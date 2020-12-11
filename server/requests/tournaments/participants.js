const { tournaments, users } = require('../../helpers/firebase')
const { send } = require('../../helpers/send')

exports.add_participant = async function (req, res) {
    let discord_id = req.body.discord_id
    let id = req.params.id

    if (!discord_id) {
        send(res, 400)
        return
    }

    let docRef = tournaments.doc(id)
    let doc = await docRef.get()

    if (!doc.exists) {
        send(res, 500)
        return
    }


    let query = users.where('discord.id', '==', discord_id)
    let qs = await query.get()
    
    if (qs.docs.length == 0) {
        send(res, 403)
        return
    }

    let userDoc = qs.docs[0]

    let data = {
        discord_id,
        games_drawn: 0,
        games_lost: 0,
        games_pending: 0,
        games_played: 0,
        games_won: 0,
        points: 0,
        uid: userDoc.id,
    }

    try {
        let participants = doc.get('participants')
        participants.push({...data})

        doc = await docRef.update({
            participants
        })

        send(res, 200, data)
    } catch {
        send(res, 500)
    }

}