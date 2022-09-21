import React from 'react';
import { Shot } from '../types';
import { useViewport } from '../utils/hooks';

interface GridProps {
    images: Shot[],
    rowTargetHeight?: number,
    borderOffset?: number,
    onClick: Function
}

const ImageGrid = ({
  images,
  rowTargetHeight = 400,
  borderOffset = 7,
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
                return (
                  <div
                    className="thumbnail-container"
                    style={{
                      marginRight: borderOffset,
                      marginBottom: borderOffset,
                    }}
                    key={`thumbnail-container-${imageIndex}`}
                  >
                    <img
                      key={imageIndex}
                      id={`img-${imageIndex}`}
                      src={image.imageUrl}
                      style={{
                        width: Math.ceil(image.width),
                        height: image.height,
                        cursor: 'pointer',
                      }}
                      onClick={() => onClick(image)}
                    />
                    <div className="image-info">
                      <div className="game">{image.name}</div>
                      {/* <div>
                        <span className="by">by</span>{' '}
                        <span className="author">{image.author}</span>
                      </div> */}
                    </div>
                  </div>
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
