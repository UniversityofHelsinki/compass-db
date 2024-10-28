SELECT
    a.id AS assignment_id,
    c.course_id,
    c.title AS course_title,
    a.topic AS assignment_topic,
    AVG(ans.order_nbr) AS average_score,
    COUNT(ans.id) AS answer_count
FROM
    COURSE c
        JOIN ASSIGNMENT a ON c.course_id = a.course_id
        JOIN ANSWER ans ON a.id = ans.assignment_id
WHERE
    c.id = $1::integer
GROUP BY
    a.id, c.course_id, c.title, a.topic
ORDER BY
    a.id;
