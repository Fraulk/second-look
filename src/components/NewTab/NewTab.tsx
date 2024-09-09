import { useEffect, useState } from "react"
import "./style.scss"
import { get, child, getDatabase, ref } from "firebase/database"
import { TODAYS_GALLERY_ID } from "../../utils/utils"
import { Author, Shot } from "../../types"
import Flickr from "../../assets/icons/Flickr"
import Instagram from "../../assets/icons/Instagram"
import Steam from "../../assets/icons/Steam"
import Twitter from "../../assets/icons/Twitter"
import Web from "../../assets/icons/Web"

const NewTab = () => {
    const dbRef = ref(getDatabase());
    const [currentShot, setCurrentShot] = useState<Shot>()
    const [authors, setAuthors] = useState<Author[]>()
    const [currentAuthor, setCurrentAuthor] = useState<Author>()
    const now = new Date()
    const [currentTime, setCurrentTime] = useState(now)

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
        <div className="new-tab">
            <img
                src={currentShot?.imageUrl}
                alt=""
                className="new-tab-image"
                onDragStart={(e) => e.preventDefault()}
            />
            <div className="datetime">
                <div className="time">
                    {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
                <div className="sep"></div>
                <div className="date">
                    {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
            <div className="links">
                {currentAuthor != undefined ? (
                    <>
                        <span>{currentAuthor?.authorNick}</span>
                        |
                        {currentAuthor?.twitter && (<div className='icon' title={currentAuthor.twitter} onClick={() => window.open(currentAuthor.twitter, "_blank")}><Twitter /></div>)}
                        {currentAuthor?.flickr && (<div className='icon' title={currentAuthor.flickr} onClick={() => window.open(currentAuthor.flickr, "_blank")}><Flickr /></div>)}
                        {currentAuthor?.instagram && (<div className='icon' title={currentAuthor.instagram} onClick={() => window.open(currentAuthor.instagram, "_blank")}><Instagram /></div>)}
                        {currentAuthor?.steam && (<div className='icon' title={currentAuthor.steam} onClick={() => window.open(currentAuthor.steam, "_blank")}><Steam /></div>)}
                        {currentAuthor?.othersocials?.length > 0 && currentAuthor.othersocials.map((soc) => (
                            <div className='icon' title={soc} onClick={() => window.open(soc, "_blank")} key={soc}><Web /></div>
                        ))}
                    </>
                ) : (
                    <span>{currentShot?.displayName}</span>
                )}
            </div>
        </div>
    )
}

export default NewTab