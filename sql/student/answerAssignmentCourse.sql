SELECT answer.assignment_id, course.title, assignment.topic, answer.value, answer.order_nbr
FROM course
         JOIN answer ON
    answer.course_id = course.course_id AND
    answer.assignment_id = $1 AND
    answer.user_name = $2
         JOIN assignment ON
    assignment.assignment_id = answer.assignment_id;
