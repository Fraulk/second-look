import { useCallback, useEffect, useRef, useState } from "react"
import LeftArrow from "../../assets/icons/LeftArrow"
import RightArrow from "../../assets/icons/RightArrow"
import { Shot } from "../../types"
import { useOutsideAlerter } from "../../utils/hooks"
import { SettingState } from "../../utils/reducer"
import "./style.scss"

interface OpenedShotProps {
    images: Shot[],
    shot: Shot,
    closeShot: Function,
    state: SettingState,
}

export const OpenedShot = ({ images, shot, closeShot, state }: OpenedShotProps) => {
    const [currentShot, setCurrentShot] = useState(shot)
    const imgRef = useRef(null)
    const arrowLeft = useRef(null)
    const arrowRight = useRef(null)
    const outOfFocusDiv = useRef(null)
    useOutsideAlerter([imgRef, arrowLeft, arrowRight, outOfFocusDiv], closeShot);
    const currentShotIndex = images.findIndex((item: Shot) => item.createdAt == currentShot.createdAt)
    const [isOutOfFocus, setIsOutOfFocus] = useState(false)

    const handleClick = (clickType: 0 | 1, e?: any) => {
        if (isOutOfFocus) {
            setIsOutOfFocus(false)
            return
        }
        if (e) e.preventDefault()
        if (state.openLinkClick == clickType) {
            document.location.href = `${state.linkApp ? 'discord://' : ''}${currentShot.messageUrl}`
            setIsOutOfFocus(true)
        }
        else
            closeShot()
    }

    const prevShot = () => {
        setIsOutOfFocus(false)
        currentShotIndex - 1 >= 0 && setCurrentShot(images[currentShotIndex - 1])
    }

    const nextShot = () => {
        setIsOutOfFocus(false)
        currentShotIndex + 1 < images.length && setCurrentShot(images[currentShotIndex + 1])
    }

    const handleKeyboard = (event: any) => {
        const { key } = event;
        switch (key) {
            case 'ArrowLeft':
                return prevShot();
            case 'ArrowRight':
                return nextShot();
            case 'Escape':
                return closeShot();
            default:
                return false;
        }
    }

    const handleScroll = (event: any) => {
        event.preventDefault()
        event.stopPropagation()
        event.wheelDelta > 0 ? prevShot() : nextShot()
        return false
    }

    useEffect(() => {
        window.addEventListener('keyup', handleKeyboard);
        window.addEventListener('wheel', handleScroll, { passive: false });
        return () => {
            window.removeEventListener('keyup', handleKeyboard);
            window.removeEventListener('wheel', handleScroll)
        }
    }, [handleKeyboard]);

    return (
        <div className="OpenedShot">
            {isOutOfFocus && (
                <div className='outOfFocus' onClick={() => setIsOutOfFocus(false)} ref={outOfFocusDiv}>
                    The window is out of focus. Click anywhere to regain focus.
                </div>
            )}
            <div className="opened-image-wrapper" onContextMenu={(e) => handleClick(1, e)}>
                {/* background-image need specified height to be auto, and so be correctly centered, too much of a pain */}
                {/* <div className="opened-image-container" style={{backgroundImage: `url("${currentShot.imageUrl}")`}}></div> */}
                {currentShotIndex - 1 >= 0 &&
                    <div className="opened-image-prev" style={{opacity: state.hudOpacity}} onClick={prevShot} ref={arrowLeft}><LeftArrow /></div>
                }
                <img
                    src={currentShot.imageUrl}
                    alt=""
                    className="opened-image-container"
                    onClick={() => handleClick(0)}
                    onContextMenu={(e) => handleClick(1, e)}
                    onDragStart={(e) => e.preventDefault()}
                    ref={imgRef}
                />
                {currentShotIndex + 1 < images.length &&
                    <div className="opened-image-next" style={{opacity: state.hudOpacity}} onClick={nextShot} ref={arrowRight}><RightArrow /></div>
                }
            </div>
        </div>
    )
}

export default OpenedShot