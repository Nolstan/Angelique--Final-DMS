
const studentsTableBody = document.getElementById('studentsTableBody');
const totalStudents = document.getElementById('totalStudents');
const tableMessage = document.getElementById('tableMessage');
const refreshButton = document.getElementById('refreshButton');

// ======================================
// FETCH AND DISPLAY STUDENTS
// ======================================
async function loadStudents() {
    studentsTableBody.innerHTML = `
        <tr>
            <td colspan="6">Loading students...</td>
        </tr>
    `;

    tableMessage.textContent = '';

    try {
        const response = await fetch('/api/students');

        if (!response.ok) {
            throw new Error('Failed to retrieve student records.');
        }

        const result = await response.json();

        const students = result.students;

        // Update total students
        totalStudents.textContent = result.total;

        // Check whether students exist
        if (students.length === 0) {
            studentsTableBody.innerHTML = `
                <tr>
                    <td colspan="6">No students registered yet.</td>
                </tr>
            `;
            return;
        }

        // Clear existing records
        studentsTableBody.innerHTML = '';

        // Display each student
        students.forEach((student, index) => {
            const row = document.createElement('tr');

            const values = [
                index + 1,
                student.registration_number,
                `${student.first_name} ${student.last_name}`,
                student.gender === 'M' ? 'Male' :
                    student.gender === 'F' ? 'Female' :
                    student.gender || 'Not specified',
                student.programme_name,
                `Year ${student.year_of_study}`
            ];

            values.forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });

            studentsTableBody.appendChild(row);
        });

    } catch (error) {
        console.error(error);

        studentsTableBody.innerHTML = `
            <tr>
                <td colspan="6">Unable to load student records.</td>
            </tr>
        `;

        tableMessage.textContent = error.message;
        tableMessage.className = 'error-message';
    }
}


// ======================================
// REFRESH BUTTON
// ======================================
refreshButton.addEventListener('click', loadStudents);


// Load students when page opens
loadStudents();
