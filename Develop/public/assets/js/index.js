let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let notes = [];


if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelector('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch('/api/notes')
    .then((response) => response.json())
    .catch((error) => console.error(error));

const saveNote = (note) => {
  return fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
    .then((response) => response.json())
    .then((data) => {
      notes.push(data);
      return data;
    })
    .catch((error) => console.error(error));
};

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote)
    .then(() => {
      getAndRenderNotes();
      renderActiveNote();
    })
    .catch((error) => console.error(error));
};

const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target.parentElement;
  const noteId = note.dataset.noteId;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId)
    .then(() => {
      getAndRenderNotes();
      renderActiveNote();
    })
    .catch((error) => console.error(error));
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = {
    id: e.target.parentElement.dataset.noteId,
    title: e.target.innerText,
    text: e.target.nextElementSibling.innerText,
  };
  renderActiveNote();
};

const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

const renderNoteList = (notes) => {
  noteList.innerHTML = '';

  if (notes.length === 0) {
    const noNotesLi = document.createElement('li');
    noNotesLi.classList.add('list-group-item');
    noNotesLi.innerText = 'No saved Notes';
    noteList.appendChild(noNotesLi);
  } else {
    notes.forEach((note) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.dataset.noteId = note.id;

      const spanTitle = document.createElement('span');
      spanTitle.classList.add('list-item-title');
      spanTitle.innerText = note.title;
      spanTitle.addEventListener('click', handleNoteView);
      li.appendChild(spanTitle);

      const spanText = document.createElement('span');
      spanText.classList.add('list-item-text');
      spanText.innerText = note.text;
      li.appendChild(spanText);

      const deleteBtn = document.createElement('i');
      deleteBtn.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      deleteBtn.addEventListener('click', handleNoteDelete);
      li.appendChild(deleteBtn);

      noteList.appendChild(li);
    });
  }
};

const getAndRenderNotes = () =>
  getNotes()
    .then((notes) => renderNoteList(notes))
    .catch((error) => console.error(error));

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('input', handleRenderSaveBtn);
  noteText.addEventListener('input', handleRenderSaveBtn);
}

getAndRenderNotes();
