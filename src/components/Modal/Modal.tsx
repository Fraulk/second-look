import { useRef } from "react";
import Close from "../../assets/icons/Close";
import "./style.scss"
import { useOutsideAlerter } from "../../utils/hooks";

interface ModalProps {
    children: React.ReactNode,
    top?: string | number;
    left?: string | number;
    bottom?: string | number;
    right?: string | number;
    style?: any;
    onClose?: () => void;
}

export const Modal = (props: ModalProps) => {
    const {children, top, left, bottom, right, style = {}, onClose = () => {}} = props
    const modalRef = useRef(null)
    useOutsideAlerter([modalRef], onClose)

    const modalPosition = top || left || bottom || right
        ? {
            position: "absolute",
            top: top ?? "unset",
            left: left ?? "unset",
            bottom: bottom ?? "unset",
            right: right ?? "unset",
            ...style
        }
        : {...style}

    return (
        <div className="modal-wrapper">
            <div className="modal" style={modalPosition} ref={modalRef}>
                {children}
            </div>
        </div>
    )
}

export const ModalHeader = (props: {children: React.ReactNode, onClose?: () => void}) => {
    const {children, onClose} = props

    return (
        <div className="modal-header">
            <div className="modal-title">
                {children}
            </div>
            {onClose &&
                <div className="modal-close" onClick={onClose}><Close /></div>
            }
        </div>
    )
}