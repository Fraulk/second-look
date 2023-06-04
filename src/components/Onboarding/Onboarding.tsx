import { createElement, Dispatch, useEffect, useMemo, useState } from "react"
import Close from "../../assets/icons/Close"
import RightArrow from "../../assets/icons/RightArrow"
import { Shot } from "../../types"
import "./style.scss"
import { SettingState } from "../../utils/reducer"
import { Modal, ModalHeader } from "../Modal/Modal"

type OnboardingProps = {
    randomShot: Shot | null,
    changeRandom: () => void,
    step: number,
    setStep: Dispatch<React.SetStateAction<number>>,
    state: SettingState
}

export const Onboarding = ({randomShot, changeRandom, step, setStep, state}: OnboardingProps) => {
    const [showRandShot, setShowRandShot] = useState(false)
    const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0})
    const [onboardingBoxPos, setOnboardingBoxPos] = useState<{x: number, y: number}>({x: -500, y: -500})

    const handleMousePos = (event: MouseEvent) => {
        setMousePos({x: event.clientX, y: event.clientY})
    }

    const handleMouseLeave = () => {
        setShowRandShot(false)
        changeRandom()
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMousePos);
        return () => {
            window.removeEventListener('mousemove', handleMousePos);
        }
    }, []);

    useEffect(() => {
        const filterBar: HTMLInputElement | null = document.querySelector('input#filter')
        let imageContainer: HTMLElement | null = document.querySelector('#thumbnail-container-1-0')
        const settingsBox: HTMLElement | null = document.querySelector('div.Settings')
        if (!imageContainer) {
            imageContainer = document.querySelector('#thumbnail-container-0-0')
        }
        document.querySelector('body')!.style.overflowY = "hidden"
        if (step == 1) {
            filterBar?.focus()
            filterBar!.parentElement!.parentElement!.style.zIndex = "11"
        }
        if (step == 2) {
            window.scrollTo(0, 0)
            imageContainer?.focus()
            if (imageContainer) imageContainer.style.zIndex = "11"
            const imgContPos = imageContainer ? {x: (imageContainer!.offsetLeft + imageContainer!.offsetWidth + 10) ?? 320, y: (imageContainer!.parentElement!.offsetTop) ?? 112}
                                              : {x: 10, y: 10}
            setOnboardingBoxPos(imgContPos)
        }
        if (step == 3) {
            settingsBox?.focus()
            settingsBox!.style.zIndex = "11"
        }

        return () => {
            document.querySelector('body')!.style.overflowY = "unset"
            filterBar!.parentElement!.parentElement!.style.zIndex = "1"
            if (imageContainer) imageContainer.style.zIndex = "unset"
            settingsBox!.style.zIndex = "1"
        }
    }, [step])

    const stepCss = {
        width: "20rem",
        height: "7rem",
        backgroundColor: "#2b2b2b77",
        position: "absolute"
    }

    return (
        // style={step > 0 ? {backgroundColor: "unset", backdropFilter: "unset"} : {}}
        <div className="onboarding" style={{opacity: state.hudOpacity}}>
            {step == 0 &&
            <>
                {showRandShot &&
                    <div className="random-shot-img" style={{left: mousePos.x, top: mousePos.y}}>
                        <img src={randomShot?.imageUrl ?? ""} alt={randomShot?.name ?? ""} />
                    </div>
                }
                <Modal onClose={() => setStep(4)}>
                    <ModalHeader onClose={() => setStep(4)}>
                        Welcome to Framed <span className="second-look">#second-look</span>
                    </ModalHeader>

                    <div className="onboarding-body">
                        <p>
                            The Framed Discord server features a channel called{" "}
                            <span className="second-look">#second-look</span>{" "}
                            where users can share links{" "}
                            <span
                                className="random-shot"
                                onMouseEnter={() => setShowRandShot(true)}
                                onMouseLeave={handleMouseLeave}
                            >
                                to their favorite shots.
                            </span>{" "}
                            To improve the viewing experience of these shots, I created a website.
                            Additionally, I came up with the idea of creating a daily gallery showcasing all of the shots from the previous day.
                        </p>
                        <p>
                            Take note that only 1000 shots are visible and 100 are loaded at first. To load more, click on the button at the bottom.
                            Thanks chatGPT for the rephrasing.
                        </p>
                    </div>
                    <div className="onboarding-next-step" onClick={() => setStep((step) => step += 1)}>Next <RightArrow /></div>
                </Modal>
            </>
            }
            {step == 1 &&
            <Modal style={stepCss} top="5rem">
                <div className="onboarding-body">
                    You can search for people using this search bar
                </div>
                <div className="onboarding-next-step" onClick={() => setStep((step) => step += 1)}>Next <RightArrow /></div>
            </Modal>
            }
            {step == 2 &&
            // <Modal style={classes.step2} left={onboardingBoxPos.x} top={onboardingBoxPos.y}
            <Modal style={stepCss} left={onboardingBoxPos.x} top={onboardingBoxPos.y}>
                <div className="onboarding-body">
                    You can mark shot as seen using this button
                </div>
                <div className="onboarding-next-step" onClick={() => setStep((step) => step += 1)}>Next <RightArrow /></div>
            </Modal>
            }
            {step == 3 &&
            <Modal style={stepCss} right={"25rem"} bottom={"1rem"}>
                <div className="onboarding-body">
                    You can change some settings here
                </div>
                <div className="onboarding-next-step" onClick={() => setStep((step) => step += 1)}>Next <RightArrow /></div>
            </Modal>
            }
        </div>
    )
}