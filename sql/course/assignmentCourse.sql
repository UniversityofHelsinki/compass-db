SELECT COURSE.title, assignment.topic
FROM ASSIGNMENT
         JOIN COURSE ON
    ASSIGNMENT.course_id = COURSE.course_id AND
    ASSIGNMENT.assignment_id = $1;

