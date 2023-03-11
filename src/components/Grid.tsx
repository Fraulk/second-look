import { useState } from 'react';
import { Shot } from '../types';
import { useViewport } from '../utils/hooks';
import { useEffect } from 'react';
import { SettingState } from '../utils/reducer';

interface GridProps {
    images: Shot[],
    rowTargetHeight?: number,
    borderOffset?: number,
    state: SettingState,
    onClick?: Function
    setOpenShot: Function
}

const ImageGrid = ({
  images,
  rowTargetHeight = 400,
  borderOffset = 7,
  state,
  onClick,
  setOpenShot
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
    const [lastPosition, setLastPosition] = useState<string | null>(localStorage.getItem("currentScrollPosition"))
    // const [lastSeen, setLastSeen] = useState<{row: number, column: number}>(JSON.parse(localStorage.getItem("currentMarkSeen") ?? "{}"))
    const [lastSeen, setLastSeen] = useState<number>(Number(localStorage.getItem("currentMarkSeen")) || 0)
    const params = new URLSearchParams(window.location.search);
    const isTodayGallery = params.get("id") == "873628046194778123"

    useEffect(() => {
      if (!isTodayGallery) {
        setLastSeen(0)
        return
      }
      if (!state.scrollToLastSeen) return
      const lastPositionRow = rows.findIndex(row => row.find((image: any) => image.createdAt == Number(lastSeen)))
      let lastPos = 0
      const seenScroll = setTimeout(() => {
        if (lastPositionRow) {
          const rowElement: HTMLElement = document.querySelector(`#row-${lastPositionRow}`)!
          lastPos = rowElement.offsetTop - 5 // pixels from the top
        }
        const seenScroll = lastPositionRow ? window.scrollTo({top: lastPos || Number(lastPosition) || 0, behavior: "smooth"}) : undefined
      }, 500);
      return () => {
        lastPositionRow && clearTimeout(seenScroll)
      }
    }, [])

    const handleSavePosition = (row: number, column: number, createdAt: number = 0) => {
      const rowElement: HTMLElement = document.querySelector(`#row-${row}`)!
      const lastPos = rowElement.offsetTop - 5 // pixels from the top
      const markAsUnseen = lastSeen == createdAt
      setLastPosition(!markAsUnseen ? lastPos.toString() : "0")
      setLastSeen(!markAsUnseen ? createdAt : 0)
      localStorage.setItem("currentScrollPosition", !markAsUnseen ? lastPos.toString() : "0")
      localStorage.setItem("currentMarkSeen", !markAsUnseen ? createdAt.toString() : "0")
    }

    const handleClick = (image: Shot, index: number, imageIndex: number, clickType: 0 | 1) => {
      if (state.openLinkClick == clickType)
        document.location.href = `${state.linkApp ? 'discord://' : ''}${image.messageUrl}`
      else
        setOpenShot(rows[index][imageIndex])
    }

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
            <div key={index} id={`row-${index}`} className="image-row">
              {row.map((image: Shot, imageIndex: number) => {
                let isTomorrow = false
                let isRowEnd = false

                if (image.createdAt) {
                  const tomorrow: Date = new Date(Math.floor(image.createdAt) * 1000)
                  tomorrow.setHours(0, 0, 0, 0)
                  const nextShot = (rows[index][imageIndex + 1] && rows[index][imageIndex + 1]) || (rows[index + 1] && rows[index + 1][0]) || rows[index][imageIndex]
                  isRowEnd = !!!(rows[index][imageIndex + 1] && !!rows[index][imageIndex + 1])
                  isTomorrow = new Date(nextShot.createdAt * 1000).getTime() <= Math.floor(tomorrow.getTime()) // if shots date is superior to tomorrow midnight, then true, else false
                }

                return (
                    <>
                        <div
                            id={`thumbnail-container-${index}-${imageIndex}`}
                            className="thumbnail-container"
                            tabIndex={1}
                            style={{
                              marginRight: borderOffset,
                              marginBottom: borderOffset,
                            }}
                            key={`thumbnail-container-${index}-${imageIndex}`}
                        >
                            <div onClick={(e) => handleClick(image, index, imageIndex, 0)} onContextMenu={(e) => handleClick(image, index, imageIndex, 1)} onDragStart={(e) => e.preventDefault()}>
                              {/* {lastSeen && (index > lastSeen.row || (index == lastSeen.row && imageIndex >= lastSeen.column)) && <div className="seen">SEEN</div>} */}
                              {state.markAsSeen && lastSeen && (image.createdAt ?? 0) <= lastSeen && <div className="seen" onDragStart={(e) => e.preventDefault()} onContextMenu={(e) => e.preventDefault()}>SEEN</div> || ""}
                                {/* <img
                                  key={`img-${index}-${imageIndex}`}
                                  id={`img-${index}-${imageIndex}`}
                                  src={image.imageUrl}
                                  style={{
                                      width: Math.ceil(image.width),
                                      height: image.height,
                                      cursor: 'pointer',
                                  }}
                                  onContextMenu={(e) => e.preventDefault()}
                                  onDragStart={(e) => e.preventDefault()}
                                //   onClick={() => onClick(image)}
                                /> */}
                                <div
                                  style={{
                                    backgroundImage: `url("${image.imageUrl}")`,
                                    backgroundSize: `${image.width}px ${image.height}px`,
                                    width: image.width,
                                    height: image.height,
                                  }}
                                  onContextMenu={(e) => e.preventDefault()}
                                  onDragStart={(e) => e.preventDefault()}
                                ></div>
                            </div>
                            <div className="image-actions">
                              {state.markAsSeen && isTodayGallery && <div className="markSeen" onClick={() => handleSavePosition(index, imageIndex, image.createdAt)}>Mark as {lastSeen == image.createdAt && "un" || ""}seen</div>}
                              <div className="fullScreen-btn" onClick={() => setOpenShot(rows[index][imageIndex])}>Fullscreen</div>
                            </div>
                            <div className="image-info">
                              <div className="game">
                                {image.name}
                              </div>
                            {/* <div>
                                <span className="by">by</span>{' '}
                                <span className="author">{image.author}</span>
                            </div> */}
                            </div>
                        </div>
                        <span style={{position: "relative", left: isRowEnd && -12 || "0"}}>
                          {isTomorrow && <span className="dateSeparator">{isTomorrow && new Date(image.createdAt! * 1000).toLocaleDateString()}<span className='arrow'>╲╱</span></span>}
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
