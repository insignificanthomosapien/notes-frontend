import React from 'react'

const Note = ({key, note, toggleImportant}) => {
    const label = note.important ? 'make not important' : 'make important'
    return(
        <li key = {key} className = 'note'>
            {note.content}
            <button onClick = {toggleImportant}>{label}</button>
        </li>
    )
}

export default Note