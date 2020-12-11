const { tournaments, games, users } = require('../../helpers/firebase')
const { send } = require('../../helpers/send')

exports.add_game = async function (req, res) {
    let id = req.params.id
    let { black, white, scheduled } = req.body
    
    if (!white || !black) {
        send(res, 400, 'either or both players not specified')
        return
    }

    let docRef = tournaments.doc(id)
    let doc = await docRef.get()

    if (!doc.exists) {
        send(res, 404)
        return
    } else if (white == black) {
        send(res, 400, 'WHITE and BLACK players are the same')
        return
    }
    
    let white_qs = await users
            .where('discord.id', '==', white)
            .get()

    let black_qs = await users
            .where('discord.id', '==', black)
            .get()

    if (white_qs.docs.length == 0 && black_qs.docs.length == 0) {
        send(res, 403, 'both players have not linked discord')
        return
    } else if (white_qs.docs.length == 0) {
        send(res, 403, 'WHITE player has not linked discord')
        return
    } else if (black_qs.docs.length == 0) {
        send(res, 403, 'BLACK player has not linked discord')
        return
    }

    try {
        let pending_games = doc.get('pending_games')

        let data = {
            black,
            white,
            scheduled: scheduled || false,
        }

        let game = await games.add({
            ...data,
            status: 'pending',
        })

        pending_games.push({
            ...data,
            id: game.id
        })

        doc = docRef.update({
            pending_games
        })

        send(res, 200, data)
    } catch {
        send(res, 500)
    }
    
}