SELECT course.* FROM course
  JOIN answer ON
    answer.course_id = course.course_id AND
    answer.user_name = $1;
