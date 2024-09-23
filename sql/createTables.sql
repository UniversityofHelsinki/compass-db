CREATE TABLE IF NOT EXISTS TEACHER (
  user_id VARCHAR(8) NOT NULL UNIQUE,
  created TIMESTAMP,
  PRIMARY KEY(user_id)
);

CREATE TABLE IF NOT EXISTS COURSE (
  id integer UNIQUE NOT NULL,
  course_id VARCHAR(255),
  course_title VARCHAR(255),
  course_description VARCHAR(255),
  created TIMESTAMP,
  start_date date,
  end_date date,
  teacher varchar(8) REFERENCES TEACHER (user_id),
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS ANSWERS(
  id SERIAL,
  studentid VARCHAR(50),
  course_id integer REFERENCES COURSE (id),
  created TIMESTAMP,
  topic_answer VARCHAR(255),
  description_answer VARCHAR(255),
  multiple_choice_answer int,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS STUDENT (
  user_id VARCHAR(8) NOT NULL unique,
  created TIMESTAMP,
  PRIMARY KEY(user_id)
);


CREATE TABLE  IF NOT EXISTS STUDENT_COURSE (
  student varchar (8) references STUDENT (user_id),
  course integer references COURSE(id)
);

CREATE SEQUENCE IF NOT EXISTS COURSE_SEQ;

CREATE TABLE IF NOT EXISTS ASSIGNMENT (
  course INTEGER REFERENCES COURSE(id),
  answer INTEGER REFERENCES ANSWERS(id),
  start_date TIMESTAMP,
  end_date TIMESTAMP
);
