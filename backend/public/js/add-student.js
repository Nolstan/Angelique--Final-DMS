
const studentForm = document.getElementById('studentForm');
const programmeSelect = document.getElementById('programme_id');
const formMessage = document.getElementById('formMessage');
const submitButton = document.getElementById('submitButton');

// ======================================
// LOAD PROGRAMMES FROM DATABASE
// ======================================
async function loadProgrammes() {
    try {
        const response = await fetch('/api/students/programmes');

        if (!response.ok) {
            throw new Error('Could not load programmes.');
        }

        const programmes = await response.json();

        programmeSelect.innerHTML =
            '<option value="">Select programme</option>';

        programmes.forEach(programme => {
            const option = document.createElement('option');

            option.value = programme.programme_id;
            option.textContent = programme.programme_name;

            programmeSelect.appendChild(option);
        });

    } catch (error) {
        console.error(error);

        programmeSelect.innerHTML =
            '<option value="">Failed to load programmes</option>';
    }
}


// ======================================
// REGISTER STUDENT
// ======================================
studentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    formMessage.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Registering...';

    const formData = new FormData(studentForm);

    const studentData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Registration failed.');
        }

        formMessage.textContent = result.message;
        formMessage.className = 'success-message';

        studentForm.reset();

    } catch (error) {
        console.error(error);

        formMessage.textContent = error.message;
        formMessage.className = 'error-message';

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Register Student';
    }
});


// Load programmes when page opens
loadProgrammes();
