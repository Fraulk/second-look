import { useEffect, useRef, useState } from "react"
import "./style.scss"
import { get, child, getDatabase, ref } from "firebase/database"
import { TODAYS_GALLERY_ID } from "../../utils/utils"
import { Author, Shot } from "../../types"
import Flickr from "../../assets/icons/Flickr"
import Instagram from "../../assets/icons/Instagram"
import Steam from "../../assets/icons/Steam"
import Twitter from "../../assets/icons/Twitter"
import Web from "../../assets/icons/Web"
import ConfigPanel from "../ConfigPanel/ConfigPanel"
import Cog from "../../assets/icons/Cog"
import Eye from "../../assets/icons/Eye"
import Resize from "../../assets/icons/Resize"

export interface ConfigList {
    datetime: boolean;
    datetimePosition: string;
    hours12: boolean;
    color: string;
    bgcolor: string;
    blurBool: boolean;
    blur: number;
    opacityBool: boolean;
    opacity: number;
    shadowBool: boolean;
}

const NewTab = () => {
    const dbRef = ref(getDatabase());
    const [currentShot, setCurrentShot] = useState<Shot>()
    const [authors, setAuthors] = useState<Author[]>()
    const [currentAuthor, setCurrentAuthor] = useState<Author>()
    const now = new Date()
    const [currentTime, setCurrentTime] = useState(now)
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false)
    const [isFullView, setIsFullView] = useState(false)
    const [isCleanView, setIsCleanView] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)
    const [config, setConfig] = useState<ConfigList>(localStorage.getItem("newTabConfig") ? JSON.parse(localStorage.getItem("newTabConfig") as string) : {
        datetime: true,
        datetimePosition: "center",
        hours12: false,
        color: "#ffffff",
        bgcolor: "#212121",
        blurBool: false,
        blur: 5,
        opacityBool: false,
        opacity: 1,
        shadowBool: true,
    })

    // Toggle shadow class for datetime
    const shadow = config.shadowBool ? 'shadow' : '';

    const firebaseObjToArray = (obj: any) => {
        let respShots: Shot[] = obj;
        respShots = Object.values(respShots)
        const windowAR = window.innerWidth / window.innerHeight
        const filteredShots = respShots.filter((shot: Shot) => Math.abs((shot.width / shot.height) - windowAR) < 1 && windowAR >= 1 && shot.width / shot.height >= 1) // || windowAR < 1 && shot.width / shot.height < 1
        const randomPos = Math.floor(Math.random() * filteredShots.length)
        const currShot = filteredShots[randomPos]
        setCurrentShot(currShot)
        if (authors && authors[currShot.id])
            setCurrentAuthor(authors[currShot.id])
    }

    const handleAuthorsData = async (authorsData: any) => {
        const authors = await authorsData.json()
        const authorList: Author[] = Object.values(authors._default)
        const normalizedAuthors: any = {}
        authorList.map((author: Author) => normalizedAuthors[author.authorid] = author)
        setAuthors(normalizedAuthors)
    }

    const handleConfigChange = (newConfig: ConfigList) => {
        setConfig(newConfig)
        if (imgRef.current)
            imgRef.current.style.opacity = (newConfig.opacityBool) ? `${newConfig.opacity}` : '1'
        localStorage.setItem("newTabConfig", JSON.stringify(newConfig))
    }

    useEffect(() => {
        get(child(dbRef, `${TODAYS_GALLERY_ID}`))
            .then((shots) => shots.exists() && firebaseObjToArray(shots.val()))
            .catch((error) => console.error(error))

        fetch("https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/authorsdb.json")
            .then(handleAuthorsData)
        
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000)

        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        if (currentShot && authors)
            setCurrentAuthor(authors[currentShot.id])
    }, [currentShot, authors])

    return (
        <div className={`new-tab ${isCleanView ? "cleaned" : ""}`} style={{backgroundColor: config.bgcolor}}>
            <div className="icon-tray icon-tray-tr">
                <div className={`icon-group group-eye ${isCleanView ? "active" : ""}`}>
                    <div className="view-btn icon" onClick={() => setIsCleanView((prev) => !prev)}>
                        <Eye />
                    </div>
                    <div className="icon-subgroup">
                        <div className="resize-btn icon" onClick={() => setIsFullView((prev) => !prev)}>
                            <Resize />
                        </div>
                    </div>
                </div>
                <div className="config-btn icon" onClick={() => setIsConfigPanelOpen(true)}>
                    <Cog />
                </div>
            </div>
            <ConfigPanel config={config} onConfigChange={handleConfigChange} open={isConfigPanelOpen} onClose={() => setIsConfigPanelOpen(false)} />
            <img
                src={currentShot?.imageUrl}
                alt=""
                className={`new-tab-image ${isFullView ? 'fit' : ''}`}
                onDragStart={(e) => e.preventDefault()}
                onLoad={(e) => e.currentTarget.style.opacity = (config.opacityBool) ? `${config.opacity}` : '1'}
                style={{ filter: (config.blurBool) ? `blur(${config.blur}px)` : 'blur(0px)' }}
                ref={imgRef}
            />
            {currentShot?.imageUrl && (
                <div
                    className={`new-tab-clone ${isCleanView ? 'active' : ''}`}
                    style={{
                        backgroundImage: 'url(' + currentShot?.imageUrl + ')',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                        filter: 'blur(20px)'
                    }}
                ></div>
            )}
            {config.datetime && (
                <div className={`datetime ${config.datetimePosition} ${shadow}`} style={{color: config.color, opacity: isCleanView ? 0 : 1}}>
                    <div className="time">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: config.hours12 })}
                    </div>
                    <div className="sep"></div>
                    <div className="date">
                        {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            )}
            <div className="links">
                {currentAuthor != undefined ? (
                    <>
                        <span>{currentAuthor?.authorNick}</span>
                        |
                        <div className="icon-group">
                            {currentAuthor?.twitter && (<div className='icon' title={currentAuthor.twitter} onClick={() => window.open(currentAuthor.twitter, "_blank")}><Twitter /></div>)}
                            {currentAuthor?.flickr && (<div className='icon' title={currentAuthor.flickr} onClick={() => window.open(currentAuthor.flickr, "_blank")}><Flickr /></div>)}
                            {currentAuthor?.instagram && (<div className='icon' title={currentAuthor.instagram} onClick={() => window.open(currentAuthor.instagram, "_blank")}><Instagram /></div>)}
                            {currentAuthor?.steam && (<div className='icon' title={currentAuthor.steam} onClick={() => window.open("steam://openurl/" + currentAuthor.steam, "_blank")}><Steam /></div>)}
                            {currentAuthor?.othersocials?.length > 0 && currentAuthor.othersocials.map((soc) => (
                                <div className='icon' title={soc} onClick={() => window.open(soc, "_blank")} key={soc}><Web /></div>
                            ))}
                        </div>
                    </>
                ) : (
                    <span>{currentShot?.displayName}</span>
                )}
            </div>
        </div>
    )
}

export default NewTab