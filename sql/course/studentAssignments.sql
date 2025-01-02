/*SELECT * FROM ANSWER JOIN ASSIGNMENT ON ASSIGNMENT.ID = ANSWER.ASSIGNMENT_ID
         WHERE ASSIGNMENT.COURSE_ID = $1 AND ANSWER.USER_NAME = $2

SELECT * FROM feedback WHERE  COURSE_ID = $1

SELECT * , course.title FROM ANSWER JOIN COURSE ON answer.course_id = course.course_id
WHERE answer.USER_NAME = $1  AND answer.COURSE_ID = $2
----------
SELECT * FROM ANSWER
    JOIN ASSIGNMENT ON ASSIGNMENT.ID = ANSWER.ASSIGNMENT_ID
    JOIN FEEDBACK ON ASSIGNMENT.COURCE_ID = FEEDBACK.COURCE_ID AND
                     ANSWER.USER_NAME = FEEDBACK.USER_NAME

WHERE ASSIGNMENT.COURSE_ID = $1 AND ANSWER.USER_NAME = $2*/
SELECT DISTINCT answer.id as answerId, answer.assignment_id, answer.course_id, answer.user_name as answer_user_name,
       answer.answer_value, answer.order_nbr as answer_order_nbr, answer.created as answer_created,
       edited as answer_edited, assignment.id as assignmentId,
       assignment.course_id, topic as assignment_topic, assignment.start_date, assignment.end_date, assignment.created,
       feedback.id as feedbackId, feedback.assignment_id as feedback_assignment_id, student as feedback_student,
       feedback.order_nbr as feedback_order_nbr,
       feedback.feedback_value, feedback.created, feedback.user_name as feedback_user_name,
       course.title as course_title,
       users.display_name as user_name
FROM ANSWER
         JOIN ASSIGNMENT ON ASSIGNMENT.ID = ANSWER.ASSIGNMENT_ID
         JOIN COURSE ON COURSE.COURSE_ID = ASSIGNMENT.COURSE_ID
         LEFT JOIN FEEDBACK ON ASSIGNMENT.COURSE_ID = FEEDBACK.COURSE_ID AND
                               ANSWER.USER_NAME = FEEDBACK.STUDENT AND
                               FEEDBACK.ASSIGNMENT_ID = ANSWER.ASSIGNMENT_ID
         LEFT JOIN USERS
                   ON USERS.USER_NAME = ANSWER.USER_NAME
WHERE ASSIGNMENT.COURSE_ID =  $1 AND ANSWER.USER_NAME = $2
