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
        <div className="Settings">
            Settings
            <div className="setting">
                Show "Mark as seen"
                <label className="setting-switch">
                    <input type="checkbox" name="markAsSeen" defaultChecked={state.markAsSeen} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="setting">
                Link discord {state.linkApp ? "app" : "web"}
                <label className="setting-switch">
                    <input type="checkbox" name="linkApp" defaultChecked={state.linkApp} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="setting">
                Scroll to last seen shot
                <label className="setting-switch">
                    <input type="checkbox" name="scrollToLastSeen" defaultChecked={state.scrollToLastSeen} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="setting">
                {state.openLinkClick ? "Right" : "Left"} click to open links
                <label className="setting-switch">
                    <input type="checkbox" name="openLinkClick" defaultChecked={!!state.openLinkClick} onChange={handleSettingChange} />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
    )
}