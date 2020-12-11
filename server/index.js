// modules

const express = require('express')
const cors = require('cors')


// request functions

const { get_user, update_user, link_discord } = require('./requests/users')

const { list_tournaments } = require('./requests/tournaments/get')
const { create_tournament } = require('./requests/tournaments/create')
const { update_info } = require('./requests/tournaments/update_info')
const { add_game } = require('./requests/tournaments/games')
const { add_participant } = require('./requests/tournaments/participants')

// logging

const { log } = require('./helpers/log')

// initialisations

const app = express()
const port = process.env.PORT || 3000

app.listen(port, _=>console.log(">> port " + port))

// middleware

app.use(cors({
    "origin": "*",
    "methods": "GET, POST"
}))

app.use(express.json())




// GET

app.get('/users/:id', log, get_user)

app.get('/tournaments/:part', log, list_tournaments)





// POST

app.post('/users/:id/update', log, update_user)
app.post('/users/:id/delete', log)
app.post('/users/:id/link_discord', log, link_discord)

app.post('/tournaments/create', log, create_tournament)

app.post('/tournaments/:id/info/update', log, update_info)

app.post('/tournaments/:id/games/add', log, add_game)
app.post('/tournaments/:id/games/delete', log)
app.post('/tournaments/:id/games/update', log)

app.post('/tournaments/:id/participants/add', log, add_participant)
app.post('/tournaments/:id/participants/remove', log)

app.post('/tournaments/:id/delete', log)















