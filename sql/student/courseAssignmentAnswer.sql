SELECT answer.assignment_id, course.title, assignment.topic, assignment.start_date, assignment.end_date, answer.course_id, answer.id
FROM course
         JOIN answer ON
    answer.course_id = course.course_id AND
    answer.user_name = $1 AND
    answer.course_id = $2
         JOIN assignment ON
    assignment.id = answer.assignment_id;
