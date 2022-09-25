import { getDatabase, ref, child, get } from "firebase/database";
import { useEffect, useState } from "react";
import ImageGrid from "../components/Grid";
import { Shot } from "../types";

export const Home = (props: any) => {
    const [shots, setShots] = useState([])
    const [allShots, setAllShots] = useState([])
    const [shotCount, setShotCount] = useState(0)
    const [link, setLink] = useState(false)
    const params = new URLSearchParams(window.location.search);
    const dbRef = ref(getDatabase());

    const firebaseObjToArray = (obj: any) => {
        let respShots = obj;
        respShots = Object.values(respShots)
        setShotCount(respShots.length)
        respShots.reverse();
        if (respShots.length > 100) {
          setShots(respShots.splice(0, 100))
          setAllShots(respShots)
        }
        else
          setShots(respShots)
    }

    useEffect(() => {
        get(child(dbRef, `${params.get("id")}`))
          .then((shots) => shots.exists() && firebaseObjToArray(shots.val()))
          .catch((error) => console.error(error))
    }, [])
    
    const handleLoadMore = () => setShots(shots.concat(allShots.splice(0, 100)))

    return (
        <div className="home">
            {shots && shots.length > 0 && 
                <>
                    <ImageGrid images={shots} borderOffset={5} link={link} />
                    {shotCount > 100 && allShots.length > 0 && 
                        <div className="more-shots" onClick={handleLoadMore}>
                        Load more
                        </div>
                    }
                    <div className="selectLink">
                      <span onClick={() => setLink(true)} className={link ? 'selectedLink' : ''}>
                        HTTP link
                      </span>
                      <span onClick={() => setLink(false)} className={!link ? 'selectedLink' : ''}>
                        App link
                      </span>
                    </div>
                </>
            || 
                <div className="error-message">No id specified</div>
            }
        </div>
    )
}