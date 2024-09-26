CREATE TABLE IF NOT EXISTS COURSE (
    id serial,
    course_id VARCHAR(255) NOT NULL unique,
    user_id VARCHAR(50),
    title VARCHAR(255),
    description VARCHAR(255),
    start_date date,
    end_date date,
    created TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS ASSIGNMENT (
    id SERIAL,
    assignment_id integer NOT NULL unique,
    course_id integer REFERENCES COURSE (course_id),
    topic varchar(255),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS QUESTION(
    id SERIAL,
    assignment_id integer REFERENCES ASSIGNMENT (assignment_id),
    order_nbr integer,
    language VARCHAR(20),
    value VARCHAR(255),
    created TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS ANSWERS(
    id SERIAL,
    assignment_id integer REFERENCES ASSIGNMENT (assignment_id),
    course_id integer REFERENCES COURSE (course_id),
    user_id VARCHAR(50),
    value VARCHAR(255),
    order_nbr integer,
    created TIMESTAMP,
    edited TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS FEEDBACK(
    id SERIAL,
    assignment_id integer REFERENCES ASSIGNMENT (assignment_id),
    course_id integer REFERENCES COURSE (course_id),
    language VARCHAR(20),
    order_nbr integer,
    value VARCHAR(255),
    created TIMESTAMP,
    PRIMARY KEY(id)
);