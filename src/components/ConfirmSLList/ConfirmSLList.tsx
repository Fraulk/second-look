import "./style.scss"
import { SettingState } from "../../utils/reducer"
import { Modal } from "../Modal/Modal"
import { useClickTypeHandler } from "../../utils/hooks"
import { Shot } from "../../types"
import { useEffect, useMemo, useRef, useState } from "react"

interface ConfirmSLListProps {
    state: SettingState,
    openConfirmSLModal: boolean,
    slList: Shot[],
    onClose: () => void,
}

export const ConfirmSLList = (props: ConfirmSLListProps) => {
    const {state, openConfirmSLModal, slList, onClose} = props
    const { handleClickType } = useClickTypeHandler(state)
    const slListRef = useRef<any>(null)
    const [isCopied, setIsCopied] = useState(false)
    const [mentionAuthor, setMentionAuthor] = useState(false)
    const [useDisplayName, setUseDisplayName] = useState(false)
    const [isOver2000Char, setIsOver2000Char] = useState(false)

    const formattedSlList = useMemo(() => {
        const listByAuthors: any = {}
        if (mentionAuthor)
            slList.map(shot => listByAuthors[`<@${shot.id}>`] = [...listByAuthors[`<@${shot.id}>`] ?? [], shot])
        else if (useDisplayName)
            slList.map(shot => listByAuthors[shot.displayName] = [...listByAuthors[shot.displayName] ?? [], shot])
        else
            slList.map(shot => listByAuthors[shot.name] = [...listByAuthors[shot.name] ?? [], shot])
        return listByAuthors
    }, [slList, mentionAuthor, useDisplayName])

    useEffect(() => {
        if (slListRef)
            setIsOver2000Char(slListRef.current.innerText.length > 2000)
    }, [slListRef])
    

    const handleOpenSLChannel = () => handleClickType("https://discord.com/channels/549986543650078722/859492383845646346")

    const handleCopyList = () => {
        let textToCopy = ""
        Object.entries(formattedSlList).map(([key, value]: [string, any]) => {
            textToCopy += key + "\n"
            value.map((item: Shot) => textToCopy += item.messageUrl + "\n")
            console.log("tset")
            textToCopy += "\n"
        })
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 3000);
    }

    const handleMentionChange = (e: any) => setMentionAuthor(e.target.checked)

    const handleDisplayNameChange = (e: any) => setUseDisplayName(e.target.checked)

    return (
        <div className="ConfirmSLList" style={{opacity: state.hudOpacity}}>
            <Modal open={openConfirmSLModal} header={<>Confirm your <span className="second-look" onClick={handleOpenSLChannel}>#second-look</span> list</>} onClose={onClose}>
                <div className="confirmsllist-body">
                    {isOver2000Char && (
                        <div>The message is over 2000 characters, keep in mind that Discord limits characters for non-nitro users to 2000 and 4000 for nitro users</div>
                    )}
                    <div className="confirmsllist-links" ref={slListRef}>
                        {formattedSlList && Object.entries(formattedSlList).map(([key, value]: [string, any]) => (
                            <>
                                <div>{key}</div>
                                {value.map((item: Shot) => (
                                    <div>{item.messageUrl}</div>
                                ))}
                                <br />
                            </>
                        ))}
                    </div>
                    <div>You can copy this text in the <span className="second-look" onClick={handleOpenSLChannel}>#second-look</span> channel to make a list</div>
                    <div className="confirmsllist-settings">
                        <div className="confirmsllist-mention-user">
                            <label className="setting-switch">
                                <input type="checkbox" name="mention" checked={mentionAuthor} onChange={handleMentionChange} />
                                <span className="slider round"></span>
                            </label>
                            <span className="confirmsllist-copy-text" onClick={() => setMentionAuthor((prev) => !prev)}>Mention the author ?</span>
                        </div>
                        <div className="confirmsllist-mention-user">
                            <label className="setting-switch">
                                <input type="checkbox" name="mention" checked={useDisplayName} onChange={handleDisplayNameChange} />
                                <span className="slider round"></span>
                            </label>
                            <span className="confirmsllist-copy-text" onClick={() => setUseDisplayName((prev) => !prev)}>Use the display name ?</span>
                        </div>
                    </div>
                    <div className="confirmsllist-copy" onClick={handleCopyList}>
                        <span className="confirmsllist-copy-text">Copy the list</span>
                        {isCopied && (<span style={{textDecoration: "unset", cursor: "auto", marginLeft: ".5rem"}}>✅</span>)}
                    </div>
                </div>
            </Modal>
        </div>
    )
}