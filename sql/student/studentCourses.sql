SELECT DISTINCT course.* FROM course
        JOIN answer ON
    answer.course_id = course.course_id AND
    answer.user_name = $1
        JOIN assignment ON
    answer.assignment_id = assignment.id