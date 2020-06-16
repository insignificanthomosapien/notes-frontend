import React, { useState, useEffect } from 'react'
import NoteService from './services/NoteService'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)

    //Loads JSON data into notes
    useEffect(() => {
      NoteService.getAll()
        .then(initialNotes => setNotes(initialNotes))
        }
      ,[])
      
    const addNote = (event) => {
      event.preventDefault()
      const noteObject = {
        content: newNote,
        date: new Date().toISOString(),
        important: Math.random() < 0.5,
        //Its better to let the server generate ids
      }
      
      NoteService
        .create(noteObject)
        .then(returnedNote => {
          setNotes(notes.concat(returnedNote))
          setNewNote('')
          setErrorMessage(`Note "${returnedNote.content}" added to directory`)
          setTimeout(() => setErrorMessage(null), 5000)
        })
    }

    const handleNoteChange = (event) => {
      console.log(event.target.value)
      setNewNote(event.target.value)
      
    }

    const toggleImportanceOf = (id) => {
      const note = notes.find(n => n.id === id)
      const changedNote = {...note, important: !note.important}

      NoteService
        .update(id, changedNote)
        .then(response => {
          setNotes(notes.map(note => note.id !== id ? note : response.data))
        })
        .catch(error => console.log('fail'))
      }

    //Determines whether all notes are shown or only the important ones
    const notesToShow = showAll ? notes : notes.filter(note => note.important)

    return (
      <div>
        <h1>Notes</h1>
        <Notification message = {errorMessage}/>
        <div>
          <button onClick = {() => setShowAll(!showAll)}>
            show {showAll ? 'important': 'all'}
          </button>
        </div>
        <ul>
          {notesToShow.map((note, iterator) => 
          <Note key = {iterator} note = {note} toggleImportant = {() => toggleImportanceOf(note.id)}/>
        )}
        </ul>
        <form onSubmit = {addNote}>
          <input 
              value = {newNote}
              onChange = {handleNoteChange}/>
          <button type = "submit">save</button>
        </form>
        <Footer />
      </div>
    )
  }

  export default App