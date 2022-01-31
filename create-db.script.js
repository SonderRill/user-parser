const { Client } = require('pg')

require('dotenv').config()

const client = new Client({
    user: process.env.PSQL_USERNAME,
    host: process.env.PSQL_HOST,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT
})

const createDatabase = async () => {
    try {
        await client.connect()
        await client.query(`DROP DATABASE IF EXISTS ${process.env.PSQL_DATABASE};`)
        await client.query(`CREATE DATABASE ${process.env.PSQL_DATABASE};`)
        await client.end()
    } catch (error) {
        console.log(error.stack)
        await client.end()
    }

}

createDatabase()
