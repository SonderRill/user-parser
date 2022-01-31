CREATE TABLE users (
    id serial PRIMARY KEY,
    email varchar(100) UNIQUE NOT NULL
);