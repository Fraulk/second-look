import { ChangeEvent, useState } from 'react';
import { Author, Shot } from '../types';
import { useClickTypeHandler, useViewport } from '../utils/hooks';
import { useEffect } from 'react';
import { SettingState } from '../utils/reducer';
import Twitter from '../assets/icons/Twitter';
import Flickr from '../assets/icons/Flickr';
import Instagram from '../assets/icons/Instagram';
import Steam from '../assets/icons/Steam';
import Web from '../assets/icons/Web';

interface GridProps {
    images: Shot[],
    authors: any,
    rowTargetHeight?: number,
    borderOffset?: number,
    state: SettingState,
    onClick?: Function,
    setOpenShot: Function,
    makeSLListMode: boolean,
    setSlList: Function,
}

const ImageGrid = ({
    images,
    authors,
    rowTargetHeight = 400,
    borderOffset = 7,
    state,
    onClick,
    setOpenShot,
    makeSLListMode,
    setSlList,
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
                id: images[i].id,
                imageUrl: images[i].imageUrl,
                messageUrl: images[i].messageUrl,
                name: images[i].name,
                displayName: images[i].displayName,
                nickname: images[i].nickname,
                width: width * state.gridSize,
                height: rowTargetHeight * state.gridSize,
                createdAt: images[i].createdAt,
                authorData: authors && images[i].id ? authors[images[i].id!] : undefined
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
        const [isOutOfFocus, setIsOutOfFocus] = useState(false)
        const { handleClickType } = useClickTypeHandler(state)
        const [selectedSLList, setSelectedSLList] = useState<number[]>([])

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
                const seenScroll = lastPositionRow ? window.scrollTo({ top: lastPos || Number(lastPosition) || 0, behavior: "smooth" }) : undefined
            }, 500);
            return () => {
                lastPositionRow && clearTimeout(seenScroll)
            }
        }, [])

        useEffect(() => {
            if (!state.markAtClose) return
            if (!isTodayGallery) return
            const markOnClose = (e: any) => handleSavePosition(0, 0, rows[0][0].createdAt, true)
            window.addEventListener('beforeunload', markOnClose)
            return () => {
                window.removeEventListener('beforeunload', markOnClose)
            }
        })

        const handleSavePosition = (row: number, column: number, createdAt: number = 0, forceMark = false) => {
            const rowElement: HTMLElement = document.querySelector(`#row-${row}`)!
            const lastPos = rowElement.offsetTop - 5 // pixels from the top
            const markAsUnseen = lastSeen == createdAt && !forceMark
            localStorage.setItem("currentScrollPosition", !markAsUnseen ? lastPos.toString() : "0")
            localStorage.setItem("currentMarkSeen", !markAsUnseen ? createdAt.toString() : "0")
            setLastPosition(!markAsUnseen ? lastPos.toString() : "0")
            setLastSeen(!markAsUnseen ? createdAt : 0)
        }

        const handleClick = (image: Shot, index: number, imageIndex: number, clickType: 0 | 1) => {
            if (isOutOfFocus) {
                setIsOutOfFocus(false)
                return
            }
            if (state.openLinkClick == clickType) {
                if (makeSLListMode)
                    handleSLImageList(!selectedSLList.includes(image.createdAt), image)
                else {
                    handleClickType(image.messageUrl)
                    setIsOutOfFocus(true)
                }
            }
            else
                setOpenShot(rows[index][imageIndex])
        }

        const handleSLImageList = (checked: boolean, image: Shot) => {
            if (image.createdAt == undefined) return
            if (checked)  {
                if (selectedSLList.length >= 30) return
                setSelectedSLList((prev) => [...prev, image.createdAt])
                setSlList((prevList: Shot[]) => [...prevList, image])
            }
            else {
                setSelectedSLList((prev) => prev.filter(item => item != image.createdAt))
                setSlList((prevList: Shot[]) => prevList.filter(item => item.createdAt != image.createdAt))
            }
        }

        return (
            <div
                className="image-rows"
                style={{
                    paddingLeft: borderOffset,
                    paddingTop: borderOffset,
                }}
            >
                {isOutOfFocus && (
                    <div className='outOfFocus' onClick={() => setIsOutOfFocus(false)}>
                        The window is out of focus. Click anywhere to regain focus.
                    </div>
                )}
                {rows.map((row, index) => {
                    return (
                        <div key={index} id={`row-${index}`} className="image-row">
                            {row.map((image: Shot & {authorData: Author}, imageIndex: number) => {
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
                                                {state.markAsSeen && lastSeen && (image.createdAt ?? 0) <= lastSeen &&
                                                    <div
                                                        className="seen"
                                                        style={{ opacity: state.hudOpacity }}
                                                        onDragStart={(e) => e.preventDefault()}
                                                        onContextMenu={(e) => e.preventDefault()}
                                                    >SEEN</div> || ""
                                                }
                                                <div
                                                    className={selectedSLList.includes(image.createdAt ?? 0) && makeSLListMode ? "sl-selected" : ""}
                                                    style={{
                                                        position: "absolute",
                                                        // backgroundColor: "red",
                                                        width: image.width,
                                                        height: image.height,
                                                        opacity: state.hudOpacity,
                                                    }}
                                                    onContextMenu={(e) => e.preventDefault()}
                                                    onDragStart={(e) => e.preventDefault()}
                                                ></div>
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
                                            <div className="image-actions" style={{ opacity: state.hudOpacity }}>
                                                {state.markAsSeen && isTodayGallery && <div className="markSeen" onClick={() => handleSavePosition(index, imageIndex, image.createdAt)}>Mark as {lastSeen == image.createdAt && "un" || ""}seen</div>}
                                                <div className="fullScreen-btn" onClick={() => setOpenShot(rows[index][imageIndex])}>Fullscreen</div>
                                            </div>
                                            <div className="image-info" style={{ opacity: state.hudOpacity }}>
                                                <div className="game">
                                                    <div title={image?.nickname || image?.displayName || ""}>{image.name}</div>
                                                    {/* <span>{image?.authorData?.authorid}</span> */}
                                                    {image?.authorData?.twitter && (<div className='icon' title={image.authorData.twitter} onClick={() => window.open(image.authorData.twitter, "_blank")}><Twitter /></div>)}
                                                    {image?.authorData?.flickr && (<div className='icon' title={image.authorData.flickr} onClick={() => window.open(image.authorData.flickr, "_blank")}><Flickr /></div>)}
                                                    {image?.authorData?.instagram && (<div className='icon' title={image.authorData.instagram} onClick={() => window.open(image.authorData.instagram, "_blank")}><Instagram /></div>)}
                                                    {image?.authorData?.steam && (<div className='icon' title={image.authorData.steam} onClick={() => window.open(image.authorData.steam, "_blank")}><Steam /></div>)}
                                                    {image?.authorData?.othersocials?.length > 0 && image.authorData.othersocials.map((soc) => (
                                                        <div className='icon' title={soc} onClick={() => window.open(soc, "_blank")}><Web /></div>
                                                    ))}
                                                </div>
                                            </div>
                                            {makeSLListMode &&
                                                <div className="image-sl-checkbox">
                                                    <input type="checkbox" name={`${index}-${imageIndex}`} checked={selectedSLList.includes(image.createdAt!)} onChange={(e) => handleSLImageList(e.target.checked, image)} />
                                                    <span className="checkmark" style={{ opacity: state.hudOpacity }}></span>
                                                </div>
                                            }
                                        </div>
                                        <span style={{ position: "relative", left: isRowEnd && -12 || "0", opacity: state.hudOpacity }}>
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
