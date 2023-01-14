import "./style.scss"

export const Settings = (props: any) => {

    return (
        <div className="Settings">
            Settings
            <div className="setting">
                Show "Mark seen"
                <label className="setting-switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
    )
}