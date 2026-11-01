-- =========================================
-- STUDENT ASSESSMENT DATABASE
-- Database: student_assessment_db
-- =========================================

USE student_assessment_db;

-- 1. DEPARTMENT
CREATE TABLE Department (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. PROGRAMME
CREATE TABLE Programme (
    programme_id INT AUTO_INCREMENT PRIMARY KEY,
    programme_name VARCHAR(100) NOT NULL UNIQUE,
    programme_level VARCHAR(50),
    department_id INT NOT NULL,

    FOREIGN KEY (department_id)
        REFERENCES Department(department_id)
);

-- 3. COURSE / MODULE
CREATE TABLE Course (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(150) NOT NULL,
    department_id INT NOT NULL,

    FOREIGN KEY (department_id)
        REFERENCES Department(department_id)
);

-- 4. PERSON
CREATE TABLE Person (
    person_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    date_of_birth DATE,
    email VARCHAR(150) UNIQUE
);

-- 5. STUDENT
CREATE TABLE Student (
    student_id INT PRIMARY KEY,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    gender VARCHAR(20),
    year_of_study INT,
    programme_id INT NOT NULL,

    FOREIGN KEY (student_id)
        REFERENCES Person(person_id),

    FOREIGN KEY (programme_id)
        REFERENCES Programme(programme_id)
);

-- 6. STAFF
CREATE TABLE Staff (
    staff_id INT PRIMARY KEY,
    employee_number VARCHAR(50) UNIQUE,
    department_id INT NOT NULL,

    FOREIGN KEY (staff_id)
        REFERENCES Person(person_id),

    FOREIGN KEY (department_id)
        REFERENCES Department(department_id)
);

-- 7. LECTURER
CREATE TABLE Lecturer (
    lecturer_id INT PRIMARY KEY,

    FOREIGN KEY (lecturer_id)
        REFERENCES Staff(staff_id)
);

-- 8. ASSESSMENT OFFICER
CREATE TABLE AssessmentOfficer (
    officer_id INT PRIMARY KEY,

    FOREIGN KEY (officer_id)
        REFERENCES Staff(staff_id)
);

-- 9. MODERATOR
CREATE TABLE Moderator (
    moderator_id INT PRIMARY KEY,

    FOREIGN KEY (moderator_id)
        REFERENCES Staff(staff_id)
);

-- 10. COURSE OFFERING
CREATE TABLE CourseOffering (
    offering_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    programme_id INT NOT NULL,
    lecturer_id INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester INT NOT NULL,

    FOREIGN KEY (course_id)
        REFERENCES Course(course_id),

    FOREIGN KEY (programme_id)
        REFERENCES Programme(programme_id),

    FOREIGN KEY (lecturer_id)
        REFERENCES Lecturer(lecturer_id),

    UNIQUE (
        course_id,
        programme_id,
        academic_year,
        semester
    ),

    CHECK (semester IN (1, 2))
);

-- 11. ENROLLMENT
CREATE TABLE Enrollment (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    offering_id INT NOT NULL,
    enrollment_date DATE,

    FOREIGN KEY (student_id)
        REFERENCES Student(student_id),

    FOREIGN KEY (offering_id)
        REFERENCES CourseOffering(offering_id),

    UNIQUE (student_id, offering_id)
);

-- 12. ASSESSMENT
CREATE TABLE Assessment (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    offering_id INT NOT NULL,
    assessment_type ENUM('COURSEWORK', 'EXAM') NOT NULL,
    title VARCHAR(150) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    maximum_score DECIMAL(8,2) NOT NULL,
    due_date DATE,

    FOREIGN KEY (offering_id)
        REFERENCES CourseOffering(offering_id),

    CHECK (weight > 0 AND weight <= 100),
    CHECK (maximum_score > 0)
);

-- 13. SUBMISSION
CREATE TABLE Submission (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    assessment_id INT NOT NULL,
    submitted_date DATETIME,
    attempt_number INT NOT NULL DEFAULT 1,

    FOREIGN KEY (student_id)
        REFERENCES Student(student_id),

    FOREIGN KEY (assessment_id)
        REFERENCES Assessment(assessment_id),

    UNIQUE (student_id, assessment_id, attempt_number)
);

-- 14. RESULT
CREATE TABLE Result (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL UNIQUE,
    moderator_id INT,
    score DECIMAL(8,2),
    grade VARCHAR(5),
    feedback TEXT,

    FOREIGN KEY (submission_id)
        REFERENCES Submission(submission_id),

    FOREIGN KEY (moderator_id)
        REFERENCES Moderator(moderator_id),

    CHECK (score IS NULL OR score >= 0)
);