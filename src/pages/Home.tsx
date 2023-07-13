import { getDatabase, ref, child, get } from "firebase/database";
import { useCallback, useEffect, useReducer, useState } from "react";
import Info from "../assets/icons/Info";
import { Filter } from "../components/Filter/Filter";
import ImageGrid from "../components/Grid";
import { Onboarding } from "../components/Onboarding/Onboarding";
import OpenedShot from "../components/OpenedShot/OpenedShot";
import { Settings } from "../components/Settings/Settings";
import { Author, Shot } from "../types";
import { createInitialState, initialState, reducer } from "../utils/reducer";
import Alert from "../assets/icons/Alert";
import { Tooltip } from "../components/Tooltip/Tooltip";
import { Changelog } from "../components/Changelog/Changelog";
import { changelog } from "../changelog";
import Eye from "../assets/icons/Eye";
import { Modal } from "../components/Modal/Modal";
import Checkmark from "../assets/icons/Checkmark";
import { ConfirmSLList } from "../components/ConfirmSLList/ConfirmSLList";

export const Home = (props: any) => {
    const [shots, setShots] = useState([])
    const [authors, setAuthors] = useState()
    const [allShots, setAllShots] = useState([])
    const [filteredShots, setFilteredShots] = useState<Shot[] | undefined>(undefined)
    const [shotCount, setShotCount] = useState(0)
    const [authorsSearch, setAuthorsSearch] = useState<string[]>([])
    const params = new URLSearchParams(window.location.search);
    const dbRef = ref(getDatabase());
    const [state, dispatch] = useReducer(reducer, initialState, createInitialState)
    const [openShot, setOpenShot] = useState(null)
    const [random, setRandom] = useState(Math.random())
    const [step, setStep] = useState(99)
    const isTodayGallery = params.get("id") == "873628046194778123"
    const shotCountAtLoad = !isTodayGallery ? 100 : (state.shotCountAtLoad ?? 100)
    const [showChangelog, setShowChangelog] = useState(false)
    const [newChangelog, setNewChangelog] = useState(0)
    const [makeSLListMode, setMakeSLListMode] = useState(false)
    const [slList, setSlList] = useState<Shot[]>([])
    const [openConfirmSLModal, setOpenConfirmSLModal] = useState(false)

    const firebaseObjToArray = (obj: any) => {
        let respShots = obj;
        respShots = Object.values(respShots)
        setShotCount(respShots.length)
        respShots.reverse();
        if (respShots.length > shotCountAtLoad) {
            setShots(respShots.splice(0, shotCountAtLoad))
            setAllShots(respShots)
        }
        else
            setShots(respShots)
    }

    const handleLoadMore = () => setShots(shots.concat(allShots.splice(0, shotCountAtLoad)))

    const onFilter = (term: any) => {
        if (!!!term) {
            setAuthorsSearch([])
            setFilteredShots(undefined)
            return
        }
        const everyShots = [...shots, ...allShots]
        const fltrdShots = everyShots.filter((item: Shot) => item.name.toLowerCase().includes(term.toLowerCase()))
        const authors = [...new Set(fltrdShots.map((item: Shot) => item.name))]
        setAuthorsSearch(authors)
        setFilteredShots(fltrdShots)
    }

    const checkNewChangelog = () => {
        const localeNewChangelog = localStorage.getItem("newChangelog")

        if (localeNewChangelog == null) {
            localStorage.setItem("newChangelog", "0")
            return changelog.length
        }

        const localeNewChangelogParsed = +localeNewChangelog

        if (localeNewChangelogParsed == changelog.length) return 0
        else if (changelog.length > localeNewChangelogParsed) return changelog.length - localeNewChangelogParsed

        return 0
    }

    const handleAuthorsData = async (authorsData: any) => {
        const authors = await authorsData.json()
        const authorList: Author[] = Object.values(authors._default) // trying to get rid of my oneliner syndrome
        const normalizedAuthors: any = {}
        authorList.map((author: Author) => normalizedAuthors[author.authorid] = author)
        setAuthors(normalizedAuthors)
    }

    useEffect(() => {
        get(child(dbRef, `${params.get("id")}`))
            .then((shots) => shots.exists() && firebaseObjToArray(shots.val()))
            .catch((error) => console.error(error))

        fetch("https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/authorsdb.json")
            .then(handleAuthorsData)
        setNewChangelog(checkNewChangelog())
    }, [])

    const handleCloseChangelog = () => {
        setShowChangelog(false)
        localStorage.setItem("newChangelog", `${changelog.length}`)
        setNewChangelog(0)
    }

    const handleOpenConfirmModal = () => {
        setOpenConfirmSLModal(false)
        setMakeSLListMode(false)
    }

    return (
        <div className="home">
            {step <= 3 && shots && shots.length > 0 &&
                <Onboarding
                    randomShot={[...shots, ...allShots][Math.floor(random * [...shots, ...allShots].length)]}
                    changeRandom={() => setRandom(Math.random())}
                    step={step}
                    setStep={setStep}
                    state={state}
                />
            }
            {showChangelog &&
                <Changelog state={state} showChangelog={showChangelog} newChangelog={newChangelog} onClose={handleCloseChangelog} />
            }
            {openConfirmSLModal &&
                <ConfirmSLList state={state} openConfirmSLModal={openConfirmSLModal} onClose={handleOpenConfirmModal} slList={slList} />
            }
            <Filter autocomplete={authorsSearch} onFilter={onFilter} state={state} />
            {shots && shots.length > 0 &&
                <>
                    {openShot != null &&
                        <OpenedShot shot={openShot} closeShot={() => setOpenShot(null)} state={state} images={filteredShots || shots} />
                    }
                    <ImageGrid images={filteredShots || shots} authors={authors} borderOffset={5} state={state} setOpenShot={setOpenShot} makeSLListMode={makeSLListMode} setSlList={setSlList} />
                    {shotCount > 100 && allShots.length > 0 && !filteredShots &&
                        <div className="more-shots" style={{ opacity: state.hudOpacity }} onClick={handleLoadMore}>
                            Load more
                        </div>
                    }
                    <Settings state={state} dispatch={dispatch} />
                    <div className="tutorial" style={{ opacity: state.hudOpacity }} onClick={() => setStep(0)}>
                        <Tooltip content="About this website">
                            <Info />
                        </Tooltip>
                    </div>
                    <div className="changelog" style={{ opacity: state.hudOpacity }} onClick={() => setShowChangelog(true)}>
                        {newChangelog > 0 && <div className="changelog-count">{newChangelog}</div>}
                        <Tooltip content="Changelog">
                            <Alert />
                        </Tooltip>
                    </div>
                    <div className="second-look-icon" style={{ opacity: state.hudOpacity }} onClick={() => setMakeSLListMode((prev) => !prev)}>
                        {makeSLListMode && <div className="changelog-count">{slList.length}</div>}
                        <Tooltip content="Make a second look list">
                            <Eye />
                        </Tooltip>
                    </div>
                    {makeSLListMode &&
                        <div className="second-look-check" style={{ opacity: state.hudOpacity }} onClick={() => setOpenConfirmSLModal(true)}>
                            <Tooltip content="Confirm the second look list">
                                <Checkmark />
                            </Tooltip>
                        </div>
                    }
                </>
                ||
                <div className="error-message">No shots to show (this isn't normal, try refreshing or contact me)</div>
            }
        </div>
    )
}