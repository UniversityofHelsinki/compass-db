SELECT
    u.user_name,
    c.course_name,
    a.answers
FROM
    user u
        JOIN
    user_course uc ON u.user_name = uc.user_name
        JOIN
    course c ON uc.course_id = c.course_id
        JOIN
    answers a ON uc.user_course_id = a.user_course_id;