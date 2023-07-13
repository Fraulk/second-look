import { useState } from "react"
import { SettingState } from "../../utils/reducer"
import { Modal, ModalHeader } from "../Modal/Modal"
import "./style.scss"
import { IChangelog, changelog } from "../../changelog"
import { parseMarkdown } from "../../utils/utils"

interface ChangelogProps {
    state: SettingState,
    showChangelog: boolean,
    newChangelog: number,
    onClose: () => void
}

export const Changelog = (props: ChangelogProps) => {
    const {state, showChangelog, newChangelog, onClose} = props

    const changelogFile = changelog

    return (
        <div className="Changelog">
            <Modal open={showChangelog} header={'Changelog'} blockScroll onClose={onClose} style={{opacity: state.hudOpacity}}>
                <div className="changelog-list">
                    {changelogFile.map((chglog: IChangelog, i: number) => (
                        <div className="changelog-content">
                            {i <= newChangelog - 1 && <div className="changelog-new"></div>}
                            <div className="changelog-date">{chglog.date.toLocaleDateString()}</div>
                            <div className="changelog-element" dangerouslySetInnerHTML={{__html: parseMarkdown(chglog.content)}}></div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    )
}