SELECT * FROM QUESTION
  JOIN ASSIGNMENT 
    ON QUESTION.ASSIGNMENT_ID = ASSIGNMENT.ID
      AND ASSIGNMENT.COURSE_ID = $1;
