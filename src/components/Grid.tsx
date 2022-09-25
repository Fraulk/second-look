import React from 'react';
import { Shot } from '../types';
import { useViewport } from '../utils/hooks';

interface GridProps {
    images: Shot[],
    rowTargetHeight?: number,
    borderOffset?: number,
    link: boolean,
    onClick?: Function
}

const ImageGrid = ({
  images,
  rowTargetHeight = 400,
  borderOffset = 7,
  link,
  onClick,
}: GridProps) => {
  const { width } = useViewport();
  const maxWidth = width - borderOffset * 2;

  const processImages = () => {
    const processedImages = [];

    for (let i = 0; i < images.length; i++) {
      let width = +images[i].width
      const height = +images[i].height
      width = width * (rowTargetHeight / height);

      const image = {
        imageUrl: images[i].imageUrl,
        messageUrl: images[i].messageUrl,
        name: images[i].name,
        width: width,
        height: rowTargetHeight,
        createdAt: images[i].createdAt
      };

      processedImages.push(image);
    }

    return processedImages;
  };

  const makeSmaller = (image: Shot, amount?: number) => {
    amount = amount || 1;

    const newHeight = image.height - amount;
    image.width = image.width * (newHeight / image.height);
    image.height = newHeight;

    return image;
  };

  const getCumulativeWidth = (images: Shot[]) => {
    let width = 0;

    for (let i = 0; i < images.length; i++) {
      width += images[i].width;
    }

    width += (images.length - 1) * borderOffset;

    return width;
  };

  const buildRows = () => {
    let currentRow = 0;
    let currentWidth = 0;
    let imageCounter = 0;
    const rows: any[] = [];
    const processedImages: Shot[] = processImages();

    while (processedImages[imageCounter]) {
      if (currentWidth >= maxWidth) {
        currentRow++;
        currentWidth = 0;
      }
      if (!rows[currentRow]) {
        rows[currentRow] = [];
      }

      rows[currentRow].push(processedImages[imageCounter]);
      currentWidth += processedImages[imageCounter].width;

      imageCounter++;
    }

    return rows;
  };

  const normalizeImage = (image: Shot) => {
    image.width = +image.width;
    image.height = +image.height;

    return image;
  };

  const normalizeImages = (images: Shot[]) => {
    for (let i = 0; i < images.length; i++) {
      normalizeImage(images[i]);
    }

    return images;
  };

  const fitImagesInRow = (images: Shot[]) => {
    while (getCumulativeWidth(images) > maxWidth) {
      for (let i = 0; i < images.length; i++) {
        images[i] = makeSmaller(images[i]);
      }
    }

    return images;
  };

  const renderGrid = (rows: any[]) => {
    return (
      <div
        className="image-rows"
        style={{
          paddingLeft: borderOffset,
          paddingTop: borderOffset,
        }}
      >
        {rows.map((row, index) => {
          return (
            <div key={index} className="image-row">
              {row.map((image: Shot, imageIndex: number) => {
                let isTomorrow = false

                if (image.createdAt) {
                  const tomorrow: Date = new Date(Math.floor(image.createdAt) * 1000)
                  tomorrow.setHours(0, 0, 0, 0)
                  const nextShot = imageIndex + 1 && rows[index][imageIndex + 1] || index + 1 && rows[index + 1][0] || rows[index][imageIndex]
                  isTomorrow = new Date(nextShot.createdAt * 1000).getTime() <= Math.floor(tomorrow.getTime()) // if shots date is superior to tomorrow midnight, then true, else false
                  console.log(isTomorrow)
                }

                return (
                    <>
                        <div
                            className="thumbnail-container"
                            style={{
                            marginRight: borderOffset,
                            marginBottom: borderOffset,
                            }}
                            key={`thumbnail-container-${index}-${imageIndex}`}
                        >
                            <a href={`${!link ? 'discord://' : ''}${image.messageUrl}`}>
                                <img
                                key={imageIndex}
                                id={`img-${imageIndex}`}
                                src={image.imageUrl}
                                style={{
                                    width: Math.ceil(image.width),
                                    height: image.height,
                                    cursor: 'pointer',
                                }}
                                //   onClick={() => onClick(image)}
                                />
                            </a>
                            <div className="image-info">
                            <div className="game">{image.name}</div>
                            {/* <div>
                                <span className="by">by</span>{' '}
                                <span className="author">{image.author}</span>
                            </div> */}
                            </div>
                        </div>
                        <span style={{position: "relative"}}>
                          {isTomorrow && <span className="dateSeparator">{isTomorrow && new Date(image.createdAt! * 1000).toLocaleDateString()}</span>}
                        </span>
                    </>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const buildGrid = () => {
    const rows = buildRows();

    for (let i = 0; i < rows.length; i++) {
      rows[i] = fitImagesInRow(rows[i]);

      rows[i] = normalizeImages(rows[i]);

      const difference = maxWidth - getCumulativeWidth(rows[i]);
      const amountOfImages = rows[i].length;

      if (amountOfImages > 1 && difference < 10) {
        const addToEach = difference / amountOfImages;
        for (let n = 0; n < rows[i].length; n++) {
          rows[i][n].width += addToEach;
        }

        rows[i] = normalizeImages(rows[i]);

        rows[i][rows[i].length - 1].width += maxWidth - getCumulativeWidth(rows[i]);
      }
    }

    return renderGrid(rows);
  };

  return buildGrid();
};

export default ImageGrid;
