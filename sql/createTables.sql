CREATE TABLE IF NOT EXISTS USERS (
    id serial,
    user_name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    created TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS USER_ROLE (
    user_id integer REFERENCES USERS (id),
    role VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS COURSE (
    id serial,
    course_id VARCHAR(255) NOT NULL UNIQUE,
    user_name VARCHAR(255),
    title VARCHAR(255),
    description VARCHAR(255),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS USER_COURSE (
    course_id varchar REFERENCES COURSE (course_id),
    user_name VARCHAR(255) REFERENCES USERS (user_name)
);
CREATE TABLE IF NOT EXISTS ASSIGNMENT (
    id SERIAL,
    course_id VARCHAR(255) REFERENCES COURSE (course_id),
    topic varchar(255),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS QUESTION (
    id SERIAL,
    assignment_id integer REFERENCES ASSIGNMENT (id),
    order_nbr integer,
    language VARCHAR(20),
    value VARCHAR(255),
    created TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS ANSWER (
    id SERIAL,
    assignment_id integer REFERENCES ASSIGNMENT (id),
    course_id VARCHAR(255) REFERENCES COURSE (course_id),
    user_name VARCHAR(255),
    value VARCHAR(255),
    order_nbr integer,
    created TIMESTAMP,
    edited TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS FEEDBACK (
    id SERIAL,
    assignment_id integer REFERENCES ASSIGNMENT (id),
    course_id VARCHAR(255) REFERENCES COURSE (course_id),
    user_name VARCHAR(255),
    student VARCHAR(255),
    order_nbr integer,
    value VARCHAR(255),
    created TIMESTAMP,
    PRIMARY KEY(id)
);
