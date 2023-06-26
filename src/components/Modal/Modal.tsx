import { ReactNode, useEffect, useRef } from "react";
import Close from "../../assets/icons/Close";
import "./style.scss"
import { useOutsideAlerter } from "../../utils/hooks";

interface ModalProps {
    children: React.ReactNode,
    open?: boolean;
    header?: ReactNode;
    blockScroll?: boolean;
    top?: string | number;
    left?: string | number;
    bottom?: string | number;
    right?: string | number;
    style?: any;
    onClose?: () => void;
}

export const Modal = (props: ModalProps) => {
    const {children, open, header, blockScroll = false, top, left, bottom, right, style = {}, onClose = () => {}} = props
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

    useEffect(() => {
        if (blockScroll)
            document.querySelector('body')!.style.overflowY = "hidden"

        return () => {
            document.querySelector('body')!.style.overflowY = "unset"
        }
    }, [])
    

    return open ? (
        <div className="modal-wrapper">
            <div className="modal" style={modalPosition} ref={modalRef}>
                {header &&
                    <ModalHeader onClose={onClose}>
                        {header}
                    </ModalHeader>
                }
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <></>
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