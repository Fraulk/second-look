import "./style.scss"

interface TooltipProps {
    children: React.ReactNode,
    content: string,
    position?: "top" | "bottom"
}

export const Tooltip = (props: TooltipProps) => {
    const {children, content, position = "top"} = props

    return (
        <div className="Tooltip">
            <div className="tooltip-element" style={{[position]: "-3rem"}}>{content}</div>
            {children}
        </div>
    )
}