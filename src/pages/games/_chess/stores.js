import ChessPlus from "./engine.js";
import { writable, derived, get } from "svelte/store";
import firebase from 'firebase/app';
import "firebase/firestore";

function create_engine_store () {
    let { subscribe, update, set } = writable(new ChessPlus())

    return {
        subscribe,
        move: (m, p) => update(c => c._move(m, p)),
        undo: (s) => update(c => c._undo(s)),
        point: (p) => update(c => c._point(p)),
        reset: () => set(new ChessPlus()),
    }
}

function create_boardstate_store () {
    return derived(
        engine,
        $engine => {
            return {
                squares: $engine._get_current_boardstate(),
                square_color: $engine.square_color,
                moves: $engine._moves,
            }
        }
    )
}

export let engine = create_engine_store()
export let boardstate = create_boardstate_store()

let db = firebase.firestore()
db.collection('games').doc('bgfvytfu')
.onSnapshot(doc => {
    let old = get(engine)
    let data = doc.data()

    let oldFEN = old.fen()
    let onlyOneMove = oldFEN == data.prevFEN && data.moves.length == old.history.length+1 && data.moves[data.moves.length-2] == old.history[old.history.length-1]

    if (oldFEN == data.currentFEN) return false

    else if (onlyOneMove) {
        engine.move(data.moves[data.moves.length-1])
    }

    else {
        engine.reset()
        data.moves.map(m => engine.move(m, false))
    }
})