import { readable } from "svelte/store"

import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

export default readable(false, set => {
    firebase.auth().onAuthStateChanged(async user => {
        try {
            if (user) {
                let docRef = firebase.firestore().collection("users").doc(user.uid)
                let doc = await docRef.get()
                

                if (doc.exists) set(doc.data())
                
                else {
                    let token = await getToken()
                    let res = await fetch('https://tournament-bott.herokuapp.com/user/createUserDoc', {
                        headers: {
                            'IdToken': token
                        }
                    })
                    if (res.status == 200) {
                        let doc = await docRef.get()
                        set(doc.data())
                    }
                    else throw new Error()
                }
                
            }
            else {
                set(false)
            }
        }

        catch (err) {
            console.log("woops, an error occured...", err)
        }
    })
})

export async function getToken () {
    let currentUser = firebase.auth().currentUser
    let token = false
    if (currentUser)
        token = await currentUser.getIdToken()
    return token
}