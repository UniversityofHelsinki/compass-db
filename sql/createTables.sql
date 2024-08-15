CREATE TABLE IF NOT EXISTS compassdb(
    id integer UNIQUE NOT NULL,
    information VARCHAR(255),
    created TIMESTAMP,
    PRIMARY KEY(id)
    );

