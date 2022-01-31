const { Client } = require('pg')

require('dotenv').config()

const client = new Client({
    user: process.env.PSQL_USERNAME,
    host: process.env.PSQL_HOST,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    database: process.env.PSQL_DATABASE
})

const createTable = async () => {
    try {
        await client.connect()
        await client.query('DROP TABLE IF EXISTS users')
        await client.query(`
        CREATE TABLE users (
            id serial PRIMARY KEY,
            email varchar(100) UNIQUE NOT NULL
        );
        `)
        await client.end()
    } catch (error) {
        console.log(error.stack)
        await client.end()
    }
}

createTable()
