DROP TABLE IF EXISTS books;
CREATE TABLE IF NOT EXISTS books(
    id SERIAL PRIMARY KEY ,
    url VARCHAR(255),
    title VARCHAR(255),
    auther VARCHAR(255),
    decreption TEXT 
);
