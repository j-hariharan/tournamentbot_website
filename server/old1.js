const admin = require("firebase-admin")
const express = require("express")
const { Chess } = require('chess.js')
const cors = require('cors')
const fetch = require('node-fetch')



const serviceAccount = require("./tournamentbot-281811-firebase-adminsdk-7lq4p-eaeccea570.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tournamentbot-281811.firebaseio.com"
});

const db = admin.firestore()




const app = express()
const port = process.env.PORT || 3000


app.use(cors({
  "origin": "*",
  "methods": "GET, POST"
}))

app.use(express.json())

app.get('/chess/:gameId/move/:move', async (req, res) => {
  let gameId = req.params['gameId']
  let move = req.params['move']

  let doc = await db.collection('games').doc(gameId).get()
  let data = doc.data()

  let lastFEN = data.currentFEN

  let chess = new Chess(lastFEN)

  let m = chess.move(move)

  if (m) {
    let newFEN = chess.fen()

    let moves = [...data.moves, move]

    try {
      await doc.ref.update({
        prevFEN: lastFEN,
        currentFEN: newFEN,
        moves,
      })
      res.status(200).send('success')
    } catch (err) {
      res.status(500).send("server error occured")
    }

  }

  else {
    res.status(400).send("invalid move")
  }

})


app.get('/user/createUserDoc', async (req, res) => {
  let token = req.get('IdToken')

  let decodedToken = false

  try {
    decodedToken = await admin.auth().verifyIdToken(token)
  }
  catch {
    res.status(401).send("Invalid ID Token")
    return
  }

  let uid = decodedToken.uid

  let docRef = db.collection('users').doc(uid)

  let doc = await docRef.get()

  if (doc.exists) {
    res.status(400).send("Bad request, user document already exists...")
  }

  else {
    try {
      await docRef.set({
        email: decodedToken.email
      })
      res.status(200).send('success')
    }

    catch {
      res.status(500).send('server error occured')
    }
  }
})

app.post('/user/update', async (req, res) => {
  let token = req.get('IdToken')
  let data = req.body || {}

  let decodedToken = false

  try {
    decodedToken = await admin.auth().verifyIdToken(token)
  }
  catch {
    res.status(401).send("Invalid ID Token")
    return
  }

  let uid = decodedToken.uid
  let docRef = db.collection('users').doc(uid)

  let doc = await docRef.get()

  if (!doc.exists) {
    res.status(400).send("Bad request, user document does not exists...")
  }

  else {
    try {
      await docRef.update({
        ...data
      })
      res.status(200).send('success')
    }
    catch {
      res.status(500).send('server error occured')
    }
  }

})

app.post('/user/getDiscordInfo', async (req, res) => {
  let token = req.get("IdToken")
  let code = req.body['code']

  let decodedToken = false

  try {
    decodedToken = await admin.auth().verifyIdToken(token)
  }
  catch {
    res.status(401).send("Invalid ID Token")
    return
  }

  let uid = decodedToken.uid

  let docRef = db.collection('users').doc(uid)
  let doc = await docRef.get()

  if(!doc.exists) {
    res.status(400).send("Bad request, user document does not exists...")
    return
  }

  let data = {
    'client_id': '761885735082524685',
    'client_secret': 'omlozxKVGIyaOqQhrRT2AsuMnquYbG4v',
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': 'https://tournamentbot-281811.web.app/verify/',
    'scope': 'identify'
  }

  try {

    let resData = await fetch('https://discordapp.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(res => res.json())

    let user = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': 'Bearer ' + resData.access_token
      }
    })
    .then(res => res.json())

    docRef.update({
      discord: {
        username: user.username,
        id: user.id,
        avatar: user.avatar,
        discriminator: user.discriminator,
      }
    })
  
    res.status(200).send('success')
  }
  catch (err) {
    console.log(err)
    res.status(500).send("server error occured")
    return
  }

})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})











// ================== bot stuff ================= //

app.get("/tournament", async (req, res) => {
  let server = req.query['server']


  try {

    let querySnapshot = await db.collection('tournaments')
    .where('server', '==', server)
    .orderBy('start_time')
    .get()

    let response = querySnapshot.docs.map(doc => {
      let data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        start_time: data.start_time,
        announcements_channel: data.announcements_channel,
        chat_channel: data.chat_channel,
      }
    })

    res.status(200).json(response)
  }

  catch (err) {
    console.log(err)
    res.status(500).send("server error occured")
  }

  
})


app.get("/tournament/:id", async (req, res) => {
  let id = req.params['id']

  try {
    let docRef = db.collection('tournaments').doc(id)
    let doc = await docRef.get()

    if (!doc.exists) {
      res.status(400).send("Tournament does not exist")
      return
    }

    let data = doc.data()

    let response = { ...data }

    res.status(200).json(response)
  }

  catch (err) {
    console.log(err)
    res.status(500).send("Server error occured")
  }
})


app.get("/tournament/:id/games", async (req, res) => {
  let id = req.params['id']

  try {
    let docRef = db.collection('tournaments').doc(id)
    let doc = await docRef.get()

    if (!doc.exists) {
      res.status(400).send("Tournament does not exist")
      return
    }

    let data = doc.data()

    let response = {
      completed_games: data.completed_games,
      ongoing_games: data.ongoing_games,
      pending_games: data.pending_games,
    }

    res.status(200).json(response)
  }

  catch (err) {
    console.log(err)
    res.status(500).send("Server error occured")
  }
})

app.get("/tournament/:id/participants", async (req, res) => {
  let id = req.params['id']

  try {
    let docRef = db.collection('tournaments').doc(id)
    let doc = await docRef.get()

    if (!doc.exists) {
      res.status(400).send("Tournament does not exist")
      return
    }

    let data = doc.data()

    let response = [ ...data.participants ]

    res.status(200).json(response)
  }

  catch (err) {
    console.log(err)
    res.status(500).send("Server error occured")
  }
})

