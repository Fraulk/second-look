import { useRef } from "react"
import { useOutsideAlerter } from "../../utils/hooks"
import { ConfigList } from "../NewTab/NewTab"
import "./style.scss"
import Close from "../../assets/icons/Close"

interface ConfigPanelProps {
    open: boolean,
    config: ConfigList,
    onConfigChange: (newConfig: ConfigList) => void,
    onClose: () => void
}

const ConfigPanel = (props: ConfigPanelProps) => {
    const { open, config, onConfigChange, onClose } = props
    const configPanelRef = useRef(null)

    useOutsideAlerter([configPanelRef], onClose)

    return (
        <div className={`config-panel${open ? " open" : ""}`} ref={configPanelRef}>
            <div className="close" onClick={() => onClose()}><Close /></div>
            <div className="config-list">
                <div className="config-item">
                    <label htmlFor="color">Text Color</label>
                    <input type="color" id="color" value={config.color} onChange={(e) => onConfigChange({...config, color: e.target.value})} />
                </div>
                <div className="config-item">
                    <label htmlFor="shadowBool">Text Shadow</label>
                    <label className="setting-switch">
                        <input type="checkbox" id="shadowBool" checked={config.shadowBool} onChange={(e) => onConfigChange({...config, shadowBool: e.target.checked})} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="toggle-group" data-toggled={config.blurBool}>
                    <div className="config-item">
                        <label htmlFor="blurBool">Blur</label>
                        <label className="setting-switch">
                            <input type="checkbox" id="blurBool" checked={config.blurBool} onChange={(e) => {onConfigChange({...config, blurBool: e.target.checked}); toggleGroup('blur-group');}} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="config-item full">
                        <label htmlFor="blur">Blur Amount</label>
                        <div className="simple-range">
                            <input type="range" id="blur" min="0" max="10" value={config.blur} onChange={(e) => onConfigChange({...config, blur: e.target.value})} />
                            <span><input disabled name="blur" value={config.blur} />px</span>
                        </div>
                    </div>
                </div>
                <div className="toggle-group" data-toggled={config.opacityBool}>
                    <div className="config-item">
                        <label htmlFor="opacityBool">Opacity</label>
                        <label className="setting-switch">
                            <input type="checkbox" id="opacityBool" checked={config.opacityBool} onChange={(e) => onConfigChange({...config, opacityBool: e.target.checked})} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="config-item full">
                        <label htmlFor="opacity">Opacity Amount</label>
                        <div className="simple-range">
                            <input type="range" id="opacity" min="0" max="1" step=".05" value={config.opacity} onChange={(e) => onConfigChange({...config, opacity: e.target.value})} />
                            <span><input disabled name="opacity" value={Math.floor(config.opacity * 100)} />%</span>
                        </div>
                    </div>
                    <div className="config-item">
                        <label htmlFor="bgcolor">Background Color</label>
                        <input type="color" id="bgcolor" value={config.bgcolor} onChange={(e) => onConfigChange({...config, bgcolor: e.target.value})} />
                    </div>
                </div>
                <div className="config-item">
                    <label htmlFor="hour12">Hours 12</label>
                    <label className="setting-switch">
                        <input type="checkbox" id="hour12" checked={config.hours12} onChange={(e) => onConfigChange({...config, hours12: e.target.checked})} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="config-item">
                    <label htmlFor="datetime">Date Time</label>
                    <label htmlFor="datetime" className="setting-switch">
                        <input type="checkbox" id="datetime" checked={config.datetime} onChange={(e) => onConfigChange({...config, datetime: e.target.checked})} />
                        <span className="slider round"></span>
                    </label>
                    {/* <input type="checkbox" checked={config.datetime} onChange={(e) => onConfigChange({...config, datetime: e.target.checked})} /> */}
                </div>
                <div className="config-item">
                    <label>Date Time Position</label>
                    <select value={config.datetimePosition} onChange={(e) => onConfigChange({...config, datetimePosition: e.target.value})}>
                        <option value="top-left">Top Left</option>
                        <option value="center-top">Top Center</option>
                        <option value="top-right">Top Right</option>
                        <option value="center-left">Center Left</option>
                        <option value="center">Center</option>
                        <option value="center-right">Center Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="center-bottom">Bottom Center</option>
                        <option value="bottom-right">Bottom Right</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default ConfigPanel