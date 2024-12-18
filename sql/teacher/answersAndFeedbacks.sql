SELECT answer.id as answerId, answer.assignment_id as assignment_id, answer.course_id, answer.user_name as answer_user_name,
       answer.value as answer_value, answer.order_nbr as answer_order_nbr, answer.created as answer_created,
       edited as answer_edited,
       assignment.course_id, topic as assignment_topic, assignment.start_date, assignment.end_date, assignment.created,
       feedback.id as feedbackId, feedback.assignment_id as feedback_assignment_id, student as feedback_student,
       feedback.order_nbr as feedback_order_nbr,
       feedback.value as feedback_value, feedback.created, feedback.user_name as feedback_user_name,
       course.title as course_title
FROM ANSWER
         JOIN ASSIGNMENT ON ASSIGNMENT.ID = ANSWER.ASSIGNMENT_ID
         JOIN COURSE ON COURSE.COURSE_ID = ASSIGNMENT.COURSE_ID
         LEFT JOIN FEEDBACK ON ASSIGNMENT.COURSE_ID = FEEDBACK.COURSE_ID AND
                               ANSWER.USER_NAME = FEEDBACK.STUDENT AND
                               FEEDBACK.ASSIGNMENT_ID = ANSWER.ASSIGNMENT_ID

WHERE ANSWER.assignment_id = $1