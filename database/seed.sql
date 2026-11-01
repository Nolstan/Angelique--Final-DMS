
-- Department
INSERT INTO Department (department_name)
VALUES ('Department of Computer Science and Information Systems');

-- Programmes
INSERT INTO Programme (programme_name, programme_level, department_id)
SELECT 'BIT', 'Bachelor', department_id
FROM Department
WHERE department_name = 'Department of Computer Science and Information Systems';

INSERT INTO Programme (programme_name, programme_level, department_id)
SELECT 'BIS', 'Bachelor', department_id
FROM Department
WHERE department_name = 'Department of Computer Science and Information Systems';

-- Courses: BIS2 Semester 1
INSERT INTO Course (course_code, course_name, department_id)
SELECT course_code, course_name, department_id
FROM Department
CROSS JOIN (
    SELECT 'OPS-201' AS course_code, 'Operating Systems I' AS course_name
    UNION ALL SELECT 'WEB-301', 'Web Technologies'
    UNION ALL SELECT 'DMS-201', 'Database Management Systems'
    UNION ALL SELECT 'DSA-201', 'Data Structures and Algorithms'
    UNION ALL SELECT 'COA-201', 'Cost Accounting I'
    UNION ALL SELECT 'FIN-201', 'Computerised Accounting'
) AS courses
WHERE department_name = 'Department of Computer Science and Information Systems';

-- Courses: BIS2 Semester 2
INSERT INTO Course (course_code, course_name, department_id)
SELECT course_code, course_name, department_id
FROM Department
CROSS JOIN (
    SELECT 'OPS-202' AS course_code, 'Operating Systems II' AS course_name
    UNION ALL SELECT 'PRG-206', 'Script Programming'
    UNION ALL SELECT 'SYS-201', 'Information Systems Audits'
    UNION ALL SELECT 'RES-201', 'Research Methods'
    UNION ALL SELECT 'FIN-202', 'Financial Accounting III'
    UNION ALL SELECT 'COA-202', 'Cost Accounting II'
) AS courses
WHERE department_name = 'Department of Computer Science and Information Systems';
