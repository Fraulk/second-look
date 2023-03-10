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
                <div className="setting-text">
                    Show "Mark as seen"
                </div>
                <div className="setting-info">
                    Hide or show the feature "Mark as seen" so that the shots don't get an overlay saying "SEEN"
                </div>
                <label className="setting-switch">
                    <input type="checkbox" name="markAsSeen" defaultChecked={state.markAsSeen} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="setting">
                <div className="setting-text">
                    Link discord {state.linkApp ? "app" : "web"}
                </div>
                <div className="setting-info">
                    Choose which link to use between the discord app version or the discord website version
                </div>
                <label className="setting-switch">
                    <input type="checkbox" name="linkApp" defaultChecked={state.linkApp} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="setting">
                <div className="setting-text">
                    Scroll to last seen shot
                </div>
                <div className="setting-info">
                    Remember your "Marked as seen" shot and scroll to it next time you access the website.
                </div>
                <label className="setting-switch">
                    <input type="checkbox" name="scrollToLastSeen" defaultChecked={state.scrollToLastSeen} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="setting">
                <div className="setting-text">
                    {state.openLinkClick ? "Right" : "Left"} click to open links
                </div>
                <div className="setting-info" style={{bottom: 6}}>
                    Choose which mouse click opens in fullscreen and which opens the link
                </div>
                <label className="setting-switch">
                    <input type="checkbox" name="openLinkClick" defaultChecked={!!state.openLinkClick} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
    )
}