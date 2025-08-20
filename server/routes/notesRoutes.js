const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const notes = require('../controller/notesController');

// All notes routes are protected
router.use(auth);

// Get all notes for the logged-in user
router.get('/', notes.listNotes);

// Get a single note by ID
router.get('/:id', notes.getNote);

// Create a new note
router.post('/', notes.createNote);

// Update a note by ID
router.put('/:id', notes.updateNote);

// Soft delete a note by ID
router.delete('/:id', notes.deleteNote);

module.exports = router;