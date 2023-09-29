import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import {Routes,Route, Navigate} from "react-router-dom"
import { NewNote } from "./NewNote"
import { Container } from "react-bootstrap"
import { useLocalStorage } from "./useLocalStorage"
import { useMemo } from "react"
import {v4 as uuidV4} from "uuid"
import { NoteList } from "./NoteList"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"


export type Note = {
  id:string;
} & NoteData

export type RawNote = {
  id:string;
} & RawNoteData

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

  const notesWithTags = useMemo(()=>{
    return notes.map(note=> {
      return {...note,tags:tags.filter(tag => note.tadIds.includes(tag.id))}
    })
  },[notes,tags])

  function onCreateNotes({tags,...data}:NoteData){
    setNotes(prevNotes => {
      return [...prevNotes,{...data,id:uuidV4(),tadIds:tags.map(tag=>tag.id)},]
    })
  }

  function onUpdateNote(id:string, {tags,...data}:NoteData){
    setNotes(prevNotes =>{
      return prevNotes.map(note =>{
        if(note.id === id){
          return {...note,...data,id:uuidV4(),tadIds:tags.map
                  (tag=>tag.id)}
        }else{
          return  note
        }
      })
      
    })
  }

  function onDeleteNote(id:string){
    setNotes(prevNote =>{
      return prevNote.filter(note => note.id !== id)
    })
  }

  function addTag(tag:Tag){
    setTags(prev => [...prev,tag])
  }

  function updateTag(id:string,label:string){
    setTags(prevTags => {
      return prevTags.map(tag => {
        if(tag.id === id){
          return  {...tag,label}
        }else{
          return tag
        }
      })
    })
  }

  function deleteTag(id:string){
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id != id)
    })
  }

  return (
    <>
    <Container className="my-4">
    <Routes>
      <Route  path="/note-taking-app" element={<NoteList notes={notesWithTags} availableTags={tags}
       onUpdateTag={updateTag} onDeleteTag={deleteTag}/>}/>
      <Route  path="/new" element={ <NewNote onSubmit={onCreateNotes} 
        onAddTag={addTag}
        availableTags={tags}/>}/>
      <Route  path="/:id" element={<NoteLayout notes={notesWithTags}/>}>
        <Route index element={<Note onDelete={onDeleteNote}/>}></Route>
        <Route path="edit" element={<EditNote  onSubmit={onUpdateNote} 
        onAddTag={addTag}
        availableTags={tags}  />}></Route>
      </Route>
      <Route  path="*" element={<Navigate to="/"/>}/>
    </Routes>

    </Container>
    </>
  )
}

export default App
