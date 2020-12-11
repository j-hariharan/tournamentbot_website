<script>
    import firebase from "firebase/app"
    import "firebase/firestore"
    import userInfo, { getToken } from "./userinfo.js"

    $: user = $userInfo

    let nameEntered = ""
    let token = getToken()

    async function submitName () {
        let token = await getToken()

        let res = await fetch('https://tournament-bott.herokuapp.com/user/update', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'IdToken': token
            },
            body: JSON.stringify({
                name: nameEntered
            })
        })
    }

    async function linkDiscord () {
        window.location = 
        "https://discord.com/api/oauth2/authorize?client_id=761885735082524685&redirect_uri=https%3A%2F%2Ftournamentbot-281811.web.app%2Fverify%2F&response_type=code&scope=identify"
    }

</script>

{#if user}
    Welcome
    {#if user.name}
        {user.name}
    {:else}
        Enter your name: <br>
        <input bind:value={nameEntered}>
        <button on:click={submitName}>Submit</button>
    {/if}
    <br><br>
    {#if user.discord}
        discord username: {user.discord.username}
    {:else}
        <button on:click={linkDiscord}>Link Discord</button>
    {/if}
{:else}
    Loading
{/if}