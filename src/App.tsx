import { useEffect, useState } from 'react'
import { getDatabase, ref, child, get } from "firebase/database";
import './App.css'
import { Onboarding } from './components/Onboarding/Onboarding'
import { Home } from './pages/Home'
import { Author } from './types';

const App = () => {
  const dbRef = ref(getDatabase());
  const [params, setParams] = useState(new URLSearchParams(window.location.search).toString())
  const [allCollections, setAllCollections] = useState<any[]>()
  const [authors, setAuthors] = useState<Author[]>()

  const handleAuthorsData = async (authorsData: any) => {
    const authors = await authorsData.json()
    const authorList: Author[] = Object.values(authors._default) // trying to get rid of my oneliner syndrome
    const normalizedAuthors: any = {}
    authorList.map((author: Author) => normalizedAuthors[author.authorid] = author)
    setAuthors(normalizedAuthors)
  }

  const handleAllCollection = (cols: any) => {
    const allCol: any[] = []
    Object.keys(cols).map(key => allCol.push({key, lastShot: Object.values(cols[key]).reverse()[0]}))
    const tgIndex = allCol.findIndex((item: any) => item.key == "873628046194778123")
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

  return (
    <div className="App">
      {params != "" 
        ? <Home />
        : <div className="sl-list">
            {allCollections && allCollections.map(col => (
              <div className='sl-element' onClick={() => handleSecondLookClick(col.key)} key={col.key}>
                <div className="sl-image" style={{backgroundImage: `url("${col.lastShot.imageUrl}")`}}></div>
                <div className="sl-title">{authors && authors[col.key] ? authors[col.key].authorNick : col.key == "873628046194778123" ? "Today's gallery" : col.key}</div>
              </div>
            ))}
          </div>
      }
      
    </div>
  )
}

export default App
