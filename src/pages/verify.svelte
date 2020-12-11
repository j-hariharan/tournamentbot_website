<script>
    import { goto } from "@roxi/routify"
    import { getToken } from "./userinfo.js"
    import firebase from "firebase/app"
    import "firebase/auth"

    let search = window.location.search
    let params = new URLSearchParams(search)

    let code = params.get('code')

    

    firebase.auth().onAuthStateChanged(makeReq)
    
    async function makeReq () {
        let token = await getToken()

        fetch('https://tournament-bott.herokuapp.com/user/getDiscordInfo', {
            method: "POST",
            headers: {
                'IdToken': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({code:code})
        })
        .then(res => $goto("../profile"))
    }
</script>