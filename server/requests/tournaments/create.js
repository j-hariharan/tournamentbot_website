const { tournaments } = require('../../helpers/firebase')
const { send } = require('../../helpers/send')

exports.create_tournament = async function (req, res) {
    let { announcements_channel, chat_channel, name, server, start_time } = req.body

    try {
        let data = {
            announcements_channel: announcements_channel || '',
            chat_channel: chat_channel || '',
            name: name || 'Tournament',
            server: server || '',
            start_time: start_time || Math.floor((new Date()).getTime()/1000),
            pending_games: [],
            completed_games: [],
            ongoing_games: [],
            participants: [],
        }

        let doc = await tournaments.add(data)

        let response = {
            ...data,
            id: doc.id,
        }

        send(res, 200, response)
    } catch {
        send(res, 500)
    }
}