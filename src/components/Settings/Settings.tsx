import { ChangeEvent, Dispatch } from "react";
import { SettingState } from "../../utils/reducer";
import "./style.scss"

interface SettingsProps {
    state: SettingState;
    dispatch: Dispatch<{ type: string; payload: any; }>;
}

export const Settings = ({state, dispatch}: SettingsProps) => {

    const handleSettingChange = (e: any) => {
        dispatch({type: e.target.name, payload: e.target.checked})
    }

    return (
        <div className="Settings" tabIndex={-1}>
            Settings
            <div className="setting">
                <div className="setting-info">
                    Hide or show the feature "Mark as seen" so that the shots don't get an overlay saying "SEEN"
                </div>
                Show "Mark as seen"
                <label className="setting-switch">
                    <input type="checkbox" name="markAsSeen" defaultChecked={state.markAsSeen} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="setting">
                <div className="setting-info">
                    Choose which link to use between the discord app version or the discord website version
                </div>
                Link discord {state.linkApp ? "app" : "web"}
                <label className="setting-switch">
                    <input type="checkbox" name="linkApp" defaultChecked={state.linkApp} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="setting">
                <div className="setting-info">
                    Remember your "Marked as seen" shot and scroll to it next time you access the website.
                </div>
                Scroll to last seen shot
                <label className="setting-switch">
                    <input type="checkbox" name="scrollToLastSeen" defaultChecked={state.scrollToLastSeen} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="setting">
                <div className="setting-info" style={{bottom: 6}}>
                    Choose which mouse click opens in fullscreen and which opens the link
                </div>
                {state.openLinkClick ? "Right" : "Left"} click to open links
                <label className="setting-switch">
                    <input type="checkbox" name="openLinkClick" defaultChecked={!!state.openLinkClick} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
    )
}