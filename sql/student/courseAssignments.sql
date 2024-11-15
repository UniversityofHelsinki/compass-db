SELECT course.title, assignment.id, assignment.topic, assignment.start_date, assignment.end_date
FROM course
         JOIN assignment ON
    assignment.course_id = course.course_id AND
    course.course_id = $1;
