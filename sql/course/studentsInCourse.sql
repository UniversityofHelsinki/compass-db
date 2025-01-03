SELECT  users.display_name, users.user_name, COUNT(answer.course_id) as count FROM users
    JOIN user_course ON
    users.user_name = user_course.user_name AND
    user_course.course_id = $1
    JOIN answer ON
    users.user_name = answer.user_name AND
    answer.course_id =  user_course.course_id group by users.display_name, users.user_name, answer.course_id