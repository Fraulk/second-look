import { ConfigList } from "../NewTab/NewTab"
import "./style.scss"

interface ConfigPanelProps {
    open: boolean,
    config: ConfigList,
    onConfigChange: (newConfig: ConfigList) => void,
    onClose: () => void
}

const ConfigPanel = (props: ConfigPanelProps) => {
    const { open, config, onConfigChange, onClose } = props

    return (
        <div className="config-panel">
            <div className="config-list">
                <div className="config-item">
                    <label htmlFor="color">Color</label>
                    <input type="color" id="color" value={config.color} onChange={(e) => onConfigChange({...config, color: e.target.value})} />
                </div>
                <div className="config-item">
                    <label htmlFor="hour12">Hours 12</label>
                    <label className="setting-switch">
                        <input type="checkbox" id="hour12" checked={config.hours12} onChange={(e) => onConfigChange({...config, hours12: e.target.checked})} />
                        <span className="slider round"></span>
                    </label>
                    {/* <input type="checkbox" checked={config.hours12} onChange={(e) => onConfigChange({...config, hours12: e.target.checked})} /> */}
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