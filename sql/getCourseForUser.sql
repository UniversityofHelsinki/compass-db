SELECT u.user_name, c.course_id, c.course_title
FROM users u
    JOIN user_courses uc ON u.user_name = uc.user_name
    JOIN courses c ON uc.course_id = c.course_id
ORDER BY u.user_name, c.course_id;