import { getDatabase, ref, child, get } from "firebase/database";
import { useEffect, useState } from "react";
import ImageGrid from "../components/Grid";

export const Home = (props: any) => {
    const [shots, setShots] = useState([])
    const [allShots, setAllShots] = useState([])
    const [shotCount, setShotCount] = useState(0)
    const params = new URLSearchParams(window.location.search);
    const dbRef = ref(getDatabase());

    const firebaseObjToArray = (obj: any) => {
        let respShots = obj;
        respShots = Object.values(respShots)
        setShotCount(respShots.length)
        console.log(respShots)
        respShots.reverse();
        if (respShots.length > 100) {
          setShots(respShots.splice(0, 100))
          setAllShots(respShots)
        }
        else
          setShots(respShots)
    }

    const handleLoadMore = () => setShots(shots.concat(allShots.splice(0, 100)))

    useEffect(() => {
        get(child(dbRef, `${params.get("id")}`))
          .then((shots) => shots.exists() && firebaseObjToArray(shots.val()))
          .catch((error) => console.error(error))
    }, [])
    

    return (
        <div className="home">
            {shots && shots.length > 0 && 
                <ImageGrid images={shots} borderOffset={5} onClick={() => console.log("test")} />
            }
        </div>
    )
}