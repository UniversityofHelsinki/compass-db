INSERT INTO ASSIGNMENT
  (COURSE_ID, TOPIC, START_DATE, END_DATE, CREATED)
VALUES
  ($1, $2, $3, $4, CURRENT_TIMESTAMP)
RETURNING *;
