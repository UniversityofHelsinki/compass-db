SELECT
    a.id AS assignment_id,
    c.course_id,
    a.topic AS assignment_topic,
    ans.order_nbr,
    (COUNT(ans.id) * 100.0 / SUM(COUNT(ans.id)) OVER (PARTITION BY a.id)) AS order_nbr_percentage,
    COUNT(ans.id) AS answer_count
FROM
    COURSE c
        JOIN
    ASSIGNMENT a ON c.course_id = a.course_id
        JOIN
    ANSWER ans ON a.id = ans.assignment_id
WHERE
    c.id = $1::integer
GROUP BY
    a.id, c.course_id, c.title, a.topic, ans.order_nbr
ORDER BY
    a.id;
