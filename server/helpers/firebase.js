const admin = require('firebase-admin')
const serviceAccount = require('../tournamentbot-281811-firebase-adminsdk-7lq4p-eaeccea570.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tournamentbot-281811.firebaseio.com"
})

const db = admin.firestore()
const auth = admin.auth()

exports.db = db
exports.auth = auth

exports.tournaments = db.collection('tournaments')
exports.games = db.collection('games')
exports.users = db.collection('users')

