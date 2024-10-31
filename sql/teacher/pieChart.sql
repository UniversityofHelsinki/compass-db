WITH AnswerCounts AS (
    SELECT
        a.id AS assignment_id,
        COUNT(ans.id) AS total_answer_count
    FROM
        ASSIGNMENT a
            JOIN
        ANSWER ans ON a.id = ans.assignment_id
    GROUP BY
        a.id
)
SELECT
    a.id AS assignment_id,
    c.course_id,
    c.title AS course_title,
    a.topic AS assignment_topic,
    a.start_date,
    a.end_date,
    ans.order_nbr,
    (COUNT(ans.id) * 100.0 / ac.total_answer_count) AS order_nbr_percentage,
    ac.total_answer_count AS answer_count
FROM
    COURSE c
        JOIN
    ASSIGNMENT a ON c.course_id = a.course_id
        JOIN
    ANSWER ans ON a.id = ans.assignment_id
        JOIN
    AnswerCounts ac ON a.id = ac.assignment_id
WHERE
    c.id = $1::integer
GROUP BY
    a.id, c.course_id, c.title, a.topic, ans.order_nbr, ac.total_answer_count
ORDER BY
    a.id;
