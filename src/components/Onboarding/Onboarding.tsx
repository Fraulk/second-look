import { Dispatch, useEffect, useMemo, useState } from "react"
import Close from "../../assets/icons/Close"
import RightArrow from "../../assets/icons/RightArrow"
import { Shot } from "../../types"
import "./style.scss"

type OnboardingProps = {
    randomShot: Shot | null,
    changeRandom: () => void,
    step: number,
    setStep: Dispatch<React.SetStateAction<number>>
}

export const Onboarding = ({randomShot, changeRandom, step, setStep}: OnboardingProps) => {
    const [showRandShot, setShowRandShot] = useState(false)
    const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0})
    const [onboardingBoxPos, setOnboardingBoxPos] = useState<{x: number, y: number}>({x: 320, y: 112})

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
        const onboardingBox: HTMLElement | null = document.querySelector(`.onboarding-modal.step-${step}`)
        const filterBar: HTMLInputElement | null = document.querySelector('input#filter')
        const imageContainer: HTMLElement | null = document.querySelector('#thumbnail-container-1-0')
        document.querySelector('body')!.style.overflow = "hidden"
        if (step == 1) {
            filterBar?.focus()
            filterBar!.parentElement!.parentElement!.style.zIndex = "11"
        }
        if (step == 2) {
            imageContainer?.focus()
            imageContainer!.style.zIndex = "11"
            setTimeout(() => {
                onboardingBox!.style.opacity = "1"
            }, 100);
            const imgContPos = {x: (imageContainer!.offsetLeft + imageContainer!.offsetWidth + 10) ?? 320, y: (imageContainer!.parentElement!.offsetTop) ?? 112}
            setOnboardingBoxPos(imgContPos)
        }

        return () => {
            document.querySelector('body')!.style.overflow = "auto"
            filterBar!.parentElement!.parentElement!.style.zIndex = "unset"
            imageContainer!.style.zIndex = "unset"
        }
    }, [step])
    

    return (
        <div className="onboarding" style={step > 0 ? {backgroundColor: "unset", backdropFilter: "unset"} : {}}>
            {step == 0 &&
            <>
                {showRandShot &&
                    <div className="random-shot-img" style={{left: mousePos.x, top: mousePos.y}}>
                        <img src={randomShot?.imageUrl ?? ""} alt={randomShot?.name ?? ""} />
                    </div>
                }
                <div className="onboarding-modal">
                    <div className="onboarding-header">
                        <div className="onboarding-title">
                            Welcome to Framed <span className="second-look">#second-look</span>
                        </div>
                        <div className="onboarding-close"><Close /></div>
                    </div>

                    <div className="onboarding-body">
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
                        Thanks chatGPT for the rephrasing
                    </div>
                    <div className="onboarding-next-step" onClick={() => setStep((step) => step += 1)}>Next <RightArrow /></div>
                </div>
            </>
            }
            {step == 1 &&
            <div className="onboarding-modal step-1">
                <div className="onboarding-body">
                    You can search for people using this search bar
                </div>
                <div className="onboarding-next-step" onClick={() => setStep((step) => step += 1)}>Next <RightArrow /></div>
            </div>
            }
            {step == 2 &&
            <div className="onboarding-modal step-2" style={{left: onboardingBoxPos.x, top: onboardingBoxPos.y}}>
                <div className="onboarding-body">
                    You can mark shot as seen using this button
                </div>
                <div className="onboarding-next-step" onClick={() => setStep((step) => step += 1)}>Next <RightArrow /></div>
            </div>
            }
        </div>
    )
}