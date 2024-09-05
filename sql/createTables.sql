CREATE TABLE IF NOT EXISTS answers(
    id integer UNIQUE NOT NULL,
    created TIMESTAMP,
    first_answer VARCHAR(255),
    second_answer VARCHAR(255),
    multiple_choice_answer int,
    PRIMARY KEY(id)
    );

