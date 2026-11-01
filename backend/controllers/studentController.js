
const pool = require('../db');

// ======================================
// ADD STUDENT
// ======================================
const addStudent = async (req, res) => {
    let connection;

    try {
        const {
            first_name,
            last_name,
            date_of_birth,
            email,
            registration_number,
            gender,
            year_of_study,
            programme_id
        } = req.body;

        // Validate required fields
        if (
            !first_name ||
            !last_name ||
            !registration_number ||
            !gender ||
            !year_of_study ||
            !programme_id
        ) {
            return res.status(400).json({
                message: 'Please provide all required student details.'
            });
        }

        connection = await pool.getConnection();

        // Start transaction
        await connection.beginTransaction();

        // Insert personal details
        const personResult = await connection.query(
            `INSERT INTO Person
                (first_name, last_name, date_of_birth, email)
             VALUES (?, ?, ?, ?)`,
            [
                first_name.trim(),
                last_name.trim(),
                date_of_birth || null,
                email?.trim() || null
            ]
        );

        const studentId = personResult.insertId;

        // Insert academic details
        await connection.query(
            `INSERT INTO Student
                (student_id, registration_number, gender,
                 year_of_study, programme_id)
             VALUES (?, ?, ?, ?, ?)`,
            [
                studentId,
                registration_number.trim(),
                gender,
                Number(year_of_study),
                Number(programme_id)
            ]
        );

        // Save both inserts
        await connection.commit();

        res.status(201).json({
            message: 'Student added successfully!',
            student_id: studentId
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error('Add student error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Registration number or email already exists.'
            });
        }

        res.status(500).json({
            message: 'Failed to add student.',
            error: error.message
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};


// ======================================
// VIEW ALL STUDENTS
// ======================================
const getAllStudents = async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();

        const students = await connection.query(`
            SELECT
                st.student_id,
                st.registration_number,
                p.first_name,
                p.last_name,
                p.date_of_birth,
                p.email,
                st.gender,
                st.year_of_study,
                pr.programme_name

            FROM Student st

            JOIN Person p
                ON st.student_id = p.person_id

            JOIN Programme pr
                ON st.programme_id = pr.programme_id

            ORDER BY
                pr.programme_name ASC,
                st.year_of_study ASC,
                st.registration_number ASC
        `);

        res.status(200).json({
            total: students.length,
            students
        });

    } catch (error) {

        console.error('Get students error:', error);

        res.status(500).json({
            message: 'Failed to retrieve students.',
            error: error.message
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};


// ======================================
// GET PROGRAMMES
// ======================================
const getProgrammes = async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();

        const programmes = await connection.query(`
            SELECT programme_id, programme_name
            FROM Programme
            ORDER BY programme_name ASC
        `);

        res.status(200).json(programmes);

    } catch (error) {

        console.error('Get programmes error:', error);

        res.status(500).json({
            message: 'Failed to retrieve programmes.'
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};


module.exports = {
    addStudent,
    getAllStudents,
    getProgrammes
};
