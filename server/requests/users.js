const { db, auth } = require('../helpers/firebase')
const { send } = require('../helpers/send')

exports.get_user = async function (req, res) {

    let token = req.get('Token')
    let uid = req.params.id

    let authorised = false
    let decodedToken

    try {
        decodedToken = await auth.verifyIdToken(token)

        if (decodedToken.uid == uid) authorised = true
        else throw "error"
    } catch {
        authorised = false
    }
    
    let docRef = db.collection('users').doc(uid)
    let doc = await docRef.get()

    if (!doc.exists) {
        if (!authorised) {
            send(res, 401)
        } else {
            try {
                doc = await docRef.set({
                    email: decodedToken.email
                })

                send(res, 200, doc.data())
            } catch {
                send(res, 500)
            }
        }
    } else {
        if (authorised) {
            send(res, 200, doc.data())
        } else {
            let data = {
                name: doc.get('name'),
                avatar: doc.get('discord.avatar')
            }
            send(res, 200, data)
        }
    }
    
}

exports.update_user = function (req, res) {

}

exports.link_discord = function (req, res) {
    
}