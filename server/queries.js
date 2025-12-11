//Connect to PG using the node-postgres package

const { Pool } = require('pg')


const pool = new Pool({

user: process.env.DB_USER || 'me',
host: process.env.DB_HOST || 'localhost',
database: process.env.DB_NAME || 'projfive',
password: process.env.DB_PASSWORD || 'password',
port: process.env.DB_PORT || 5432
})

//CREATE links
const createLink = (req, res) => {
    const { name, url } = req.body
    
    pool.query('INSERT INTO links (name, url) VALUES ($1, $2) RETURNING *', [name, url], (error, result) => {
        if(error){
            throw error;
        }
        res.status(201).json(result.rows[0])
    })
}

//READ links
const getLinks = (req, res) =>{
    pool.query('SELECT * FROM links ORDER BY id ASC', (error, result) =>{
        if(error){
            throw error;
        }    
        res.status(200).json(result.rows)
        })
}

//DELETE links
const deleteLink = (req, res) => {
    const id = parseInt(req.params.id)
    
    pool.query('DELETE FROM links WHERE id = $1', [id], (error, result) => {
        if(error){
            throw error;
        }
        res.status(200).json({ message: `Link deleted with ID: ${id}` })
    })
}

// export functions
module.exports = {
    createLink,
    getLinks,
    deleteLink,
}