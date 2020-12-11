<script>
    import firebase from "firebase/app"
    import "firebase/auth"
    import { url } from "@sveltech/routify"
    import userInfo from "./userInfo.js"


    $: user = $userInfo

    let provider = new firebase.auth.GoogleAuthProvider()

    function signIn () {
        firebase.auth().signInWithPopup(provider)
        .catch(err => {
            console.log(err)
        })
    }

    function signOut () {
        firebase.auth().signOut()
    }
</script>

{#if user}
    Logged in!
    <br>
    <button on:click={signOut}>Sign Out</button>
    <br>
    <a href={$url('../profile')}>Profile</a>
{:else}
    <button on:click={signIn}>Sign In</button>
{/if}