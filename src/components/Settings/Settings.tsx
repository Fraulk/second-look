import { ChangeEvent, Dispatch } from "react";
import { SettingState } from "../../utils/reducer";
import "./style.scss"

interface SettingsProps {
    state: SettingState | any;
    dispatch: Dispatch<{ type: string; payload: any; }>;
}

export const Settings = ({state, dispatch}: SettingsProps) => {
    const params = new URLSearchParams(window.location.search);
    const isTodayGallery = params.get("id") == "873628046194778123"

    const handleSettingChange = (e: any) => {
        dispatch({type: e.target.name, payload: e.target.checked})
    }

    const handleSettingNumberChange = (e: any) => {
        const value = Math.min(Math.max(e.target.value, 10), 1000)
        dispatch({type: e.target.name, payload: value})
    }

    const settingList = [
        {name: "markAsSeen", label: 'Show "Mark as seen"', info: 'Hide or show the feature "Mark as seen" so that the shots don\'t get an overlay saying "SEEN"', type: "boolean", showOnlyOnTodaysGallery: true},
        {name: "linkApp", label: `Link discord ${state.linkApp ? "app" : "web"}`, info: 'Choose which link to use between the discord app version or the discord website version', type: "boolean", showOnlyOnTodaysGallery: false},
        {name: "scrollToLastSeen", label: 'Scroll to last seen shot"', info: 'Remember your "Marked as seen" shot and scroll to it next time you access the website.', type: "boolean", showOnlyOnTodaysGallery: true},
        {name: "openLinkClick", label: `${state.openLinkClick ? "Right" : "Left"} click to open links`, info: 'Choose which mouse click opens in fullscreen and which opens the link', type: "boolean", showOnlyOnTodaysGallery: false},
        {name: "shotCountAtLoad", label: 'Shot count at page load', info: 'Specify how much shot you want to load when opening the website. The lower, the faster site loads', type: "number", showOnlyOnTodaysGallery: true},
    ]

    return (
        <div className="Settings" tabIndex={-1}>
            Settings
            {settingList.map((item: {name: string, label: string, info: string, type: string, showOnlyOnTodaysGallery: boolean}, i: number) => (
                <>
                {(isTodayGallery || isTodayGallery == false && (isTodayGallery == false && item.showOnlyOnTodaysGallery == false)) &&
                    <div className="setting">
                        <div className="setting-text">
                            {item.label}
                        </div>
                        <div className="setting-info" style={i == settingList.length - 1 ? {bottom: 6} : {}}>
                            {item.info}
                        </div>
                        {item.type == "boolean" &&
                            <label className="setting-switch">
                                <input type="checkbox" name={item.name} defaultChecked={state[item.name]} onChange={handleSettingChange} />
                                <span className="slider round"></span>
                            </label>
                        }
                        {item.type == "number" &&
                            <input type="number" min={10} max={1000} name={item.name} className="setting-number" defaultValue={state[item.name]} onChange={handleSettingNumberChange} />
                        }
                    </div>
                }
                </>
            ))}
        </div>
    )
}