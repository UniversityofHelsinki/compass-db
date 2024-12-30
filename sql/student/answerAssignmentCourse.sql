SELECT answer.assignment_id, course.title, assignment.topic, answer.answer_value, answer.order_nbr, answer.course_id, answer.id
FROM course
         JOIN answer ON
    answer.course_id = course.course_id AND
    answer.assignment_id = $1 AND
    answer.user_name = $2 AND
    answer.course_id = $3
         JOIN assignment ON
    assignment.id = answer.assignment_id;
