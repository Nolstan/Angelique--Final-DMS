
const express = require('express');

const router = express.Router();

const {
    addStudent,
    getAllStudents,
    getProgrammes
} = require('../controllers/studentController');

// GET all students
router.get('/', getAllStudents);

// GET available programmes
router.get('/programmes', getProgrammes);

// ADD a student
router.post('/', addStudent);

module.exports = router;
