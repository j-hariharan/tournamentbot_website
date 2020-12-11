const { tournaments } = require('../../helpers/firebase')
const { send } = require('../../helpers/send')

exports.update_info = async function (req, res) {
    let id = req.params.id
    let body = req.body

    let docRef = tournaments.doc(id)
    let doc = await docRef.get()

    if (!doc.exists) {
        send(res, 404)
        return
    }

    try {
        await docRef.update({...body})

        let response = {
            ...doc.data(),
            ...body,
            id: doc.id
        }

        send(res, 200, response)
    } catch {
        send(res, 500)
    }

}