import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import {Routes,Route, Navigate} from "react-router-dom"
import { NewNote } from "./NewNote"
import { Container } from "react-bootstrap"
import { useLocalStorage } from "./useLocalStorage"


export type Note = {
  id:string;
} & NoteData

export type RawNote = {
  id:string;
  
}

export type RawNoteData = {
  title:string;
  markdown:string;
  tadIds:string[]
}

export type NoteData = {
  title:string
  markdown:string
  tags:Tag[]
}

export type Tag = {
  id:string
  label:string
}

function App() {

  const [notes,setNotes]= useLocalStorage<RawNote[]>("NOTES",[])
  const [tags,setTags]= useLocalStorage<Tag[]>("TAGs",[])

  return (
    <>
    <Container className="my-4">
    <Routes>
      <Route  path="/" element={<h1> Home </h1>}/>
      <Route  path="/new" element={ <NewNote/>}/>
      <Route  path="/:id">
        <Route index element={1}></Route>
        <Route path="edit" element={<h1>Edit</h1>}></Route>
      </Route>
      <Route  path="*" element={<Navigate to="/"/>}/>
    </Routes>

    </Container>
    </>
  )
}

export default App
