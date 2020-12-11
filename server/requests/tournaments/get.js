const { tournaments } = require('../../helpers/firebase')
const { send } = require('../../helpers/send')


exports.list_tournaments = async function (req, res) {
    let id = req.query.id
    let server = req.query.server
    let name = req.query.name
    let chat = req.query.chat
    let part = req.params.part

    let docs = []

    if (id) {
        let docRef = tournaments.doc(id)
        let doc = await docRef.get()

        if (!doc.exists) {
            send(res, 404)
            return
        } else {
            docs = [doc]
        }

    } else if (chat) {
        let query = tournaments
                .where('chat_channel', '==', chat)

        let querySnapshot = await query.get()

        docs = querySnapshot.docs
    } else {
        let query = tournaments
                .where('server', '==', server)
                .where('name', '==', name)

        let querySnapshot = await query.get()

        docs = querySnapshot.docs
    }

    let data = []

    if (part == 'snippet') {
        data = docs.map(doc => ({
            announcements_channel: doc.get('announcements_channel'),
            chat_channel: doc.get('chat_channel'),
            server: doc.get('server'),
            name: doc.get('name'),
            start_time: doc.get('start_time'),
            id: doc.id,
        }))
    } else if (part == 'games') {
        data = docs.map(doc => ({
            completed_games: doc.get('completed_games'),
            ongoing_games: doc.get('ongoing_games'),
            pending_games: doc.get('pending_games'),
            id: doc.id,
        }))
    } else if (part == 'participants') {
        data = docs.map(doc => ({
            participants: doc.get('participants'),
            id: doc.id,
        }))
    } else if (part == 'all') {
        data = docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        }))
    }

    send(res, 200, data)

}