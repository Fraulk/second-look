import { useEffect, useState } from 'react'
import { getDatabase, ref, child, get } from "firebase/database";
import './App.css'
import { Onboarding } from './components/Onboarding/Onboarding'
import { Home } from './pages/Home'
import { Author } from './types';
import { createBrowserRouter, createHashRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { TODAYS_GALLERY_ID } from './utils/utils';
import NewTab from './components/NewTab/NewTab';

const App = () => {
    const dbRef = ref(getDatabase());
    const [params, setParams] = useState(new URLSearchParams(window.location.search).toString())
    const [allCollections, setAllCollections] = useState<any[]>()
    const [authors, setAuthors] = useState<Author[]>()

    const handleAuthorsData = async (authorsData: any) => {
        const authors = await authorsData.json()
        const authorList: Author[] = Object.values(authors._default)
        const normalizedAuthors: any = {}
        authorList.map((author: Author) => normalizedAuthors[author.authorid] = author)
        setAuthors(normalizedAuthors)
    }

    const handleAllCollection = (cols: any) => {
        const allCol: any[] = []
        Object.keys(cols).map(key => allCol.push({ key, lastShot: Object.values(cols[key]).reverse()[0] }))
        const tgIndex = allCol.findIndex((item: any) => item.key == TODAYS_GALLERY_ID)
        allCol.unshift(...allCol.splice(tgIndex, 1))
        setAllCollections(allCol)
    }

    useEffect(() => {
        if (params != "") return
        get(child(dbRef, "/"))
            .then((cols) => cols.exists() && handleAllCollection(cols.val()))
            .catch((error) => console.error(error))

        fetch("https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/authorsdb.json")
            .then(handleAuthorsData)
    }, [])

    const handleSecondLookClick = (id: string) => {
        history.pushState(null, "tests", `?id=${id}`)
        setParams(id)
    }

    const Error404 = () => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: "8px" }}>
            <h1>404</h1>
            <h2>Page not found</h2>
        </div>
    )

    const router = createHashRouter([
        {
            path: "/",
            element: <AllCollection allCollections={allCollections} authors={authors} />,
            errorElement: <Error404 />
        },
        {
            path: "/gallery/:id",
            element: <Home />,
            errorElement: <Error404 />
        },
        {
            path: "/new-tab",
            element: <NewTab />,
            errorElement: <Error404 />
        },
    ]);

    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    )
}

const AllCollection = (props: { allCollections: any, authors: any }) => {
    const { allCollections, authors } = props
    const navigate = useNavigate()

    return (
        <div className="sl-list">
            {allCollections && allCollections.map((col: any) => (
                <div className='sl-element' onClick={() => navigate(`gallery/${col.key == TODAYS_GALLERY_ID ? "todays-gallery" : col.key}`)} key={col.key}>
                    <div className="sl-image" style={{ backgroundImage: `url("${col.lastShot.imageUrl}")` }}></div>
                    <div className="sl-title">{authors && authors[col.key] ? authors[col.key].authorNick : col.key == TODAYS_GALLERY_ID ? "Today's gallery" : col.key}</div>
                </div>
            ))}
        </div>
    )
}

export default App
