<script>
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
  
  import firebase from "firebase/app"

  const firebaseConfig = {
    apiKey: "AIzaSyDE_Q2qEI0hoy2pLNcY3K4Ukue2LFg9TZ8",
    authDomain: "tournamentbot-281811.firebaseapp.com",
    databaseURL: "https://tournamentbot-281811.firebaseio.com",
    projectId: "tournamentbot-281811",
    storageBucket: "tournamentbot-281811.appspot.com",
    messagingSenderId: "1060456292539",
    appId: "1:1060456292539:web:a84df434f0898940b3099e"
  };

  firebase.initializeApp(firebaseConfig)
</script>

<style  global>
  @import "../assets/global.css";
</style>

<Router {routes} />