SELECT * , course.title FROM ANSWER
    JOIN COURSE ON
    answer.course_id = course.course_id
WHERE answer.USER_NAME = $1  AND answer.COURSE_ID = $2