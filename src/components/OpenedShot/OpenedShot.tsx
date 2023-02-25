import { useRef } from "react"
import { Shot } from "../../types"
import { useOutsideAlerter } from "../../utils/hooks"
import { SettingState } from "../../utils/reducer"
import "./style.scss"

interface OpenedShotProps {
    shot: Shot,
    closeShot: Function,
    state: SettingState,
}

export const OpenedShot = ({ shot, closeShot, state }: OpenedShotProps) => {
    const imgRef = useRef(null)
    useOutsideAlerter(imgRef, closeShot);

    const handleClick = (clickType: 0 | 1, e?: any) => {
        if (e) e.preventDefault()
        if (state.openLinkClick == clickType)
            document.location.href = `${state.linkApp ? 'discord://' : ''}${shot.messageUrl}`
        else
            closeShot()
    }

    return (
        <div className="OpenedShot">
            <div className="opened-image-wrapper" onContextMenu={(e) => handleClick(1, e)}>
                {/* background-image need specified height to be auto, and so be correctly centered, too much of a pain */}
                {/* <div className="opened-image-container" style={{backgroundImage: `url("${shot.imageUrl}")`}}></div> */}
                <img
                  src={shot.imageUrl}
                  alt=""
                  className="opened-image-container"
                  onClick={() => handleClick(0)}
                  onContextMenu={(e) => handleClick(1, e)}
                  onDragStart={(e) => e.preventDefault()}
                  ref={imgRef}
                />
            </div>
        </div>
    )
}

export default OpenedShot