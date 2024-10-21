SELECT COURSE.title, ASSIGNMENT.topic, ASSIGNMENT.course_id
FROM ASSIGNMENT
         JOIN COURSE ON
    ASSIGNMENT.course_id = COURSE.course_id AND
    ASSIGNMENT.assignment_id = $1;
