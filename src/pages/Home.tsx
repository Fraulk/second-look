import { getDatabase, ref, child, get } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { Filter } from "../components/Filter/Filter";
import ImageGrid from "../components/Grid";
import { Shot } from "../types";

export const Home = (props: any) => {
    const [shots, setShots] = useState([])
    const [allShots, setAllShots] = useState([])
    const [filteredShots, setFilteredShots] = useState<Shot[] | undefined>(undefined)
    const [shotCount, setShotCount] = useState(0)
    const [link, setLink] = useState(false)
    const [authorsSearch, setAuthorsSearch] = useState<string[]>([])
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

    const onFilter = (term: any) => {
      if(!!!term) {
        setAuthorsSearch([])
        setFilteredShots(undefined)
        return 
      }
      // console.log(term)
      const everyShots = [...shots, ...allShots]
      const fltrdShots = everyShots.filter((item: Shot) => item.name.toLowerCase().includes(term.toLowerCase()))
      const authors = [...new Set(fltrdShots.map((item: Shot) => item.name))]
      setAuthorsSearch(authors)
      setFilteredShots(fltrdShots)
    }

    return (
        <div className="home">
          <Filter autocomplete={authorsSearch} onFilter={onFilter} />
            {shots && shots.length > 0 && 
                <>
                    <ImageGrid images={filteredShots || shots} borderOffset={5} link={link} />
                    {shotCount > 100 && allShots.length > 0 && !filteredShots &&
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