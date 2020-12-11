<script>
    import { createEventDispatcher } from "svelte";
    import { crossfade } from 'svelte/transition'

    const dispatch_move = createEventDispatcher()
    const [send, receive] = crossfade({duration: 300});


    export let boardstate

    $: squares = [...boardstate.squares]
    $: square_color = boardstate.square_color

    let moves = false




    function piece_clicked (s) {
        let m = boardstate.moves(s)

        if (moves && moves[0].from == s) moves = false
        else if (m.length) moves = m
        else m = false
    }

    function move_clicked (m) {
        moves = false
        dispatch_move('move', {move: m.san})
    }

</script>

<div class="container">
    {#each squares as [ square, piece ]}
        <div
            class={`square ${square_color(square)}`}
            style={`grid-area: ${square}`}
        >
            {#if piece}
                <img
                    class={`piece`}
                    src={`/images/pieces/${piece.type}${piece.color}.png`}
                    alt=""
                    on:click={() => piece_clicked(square)}
					in:receive="{{key: piece.pid}}"
					out:send="{{key: piece.pid}}"
                >
            {/if}
        </div>
    {/each}

    {#if moves}
        {#each moves as move}
            <div
                class={`move`}
                style={`grid-area: ${move.to}`}
            >
                <img
                    src={`/images/moves/${boardstate.squares.get(move.to) ? "capture.png" : "move.png"}`}
                    alt=""
                    on:click={() => move_clicked(move)}
                >
            </div>
        {/each}
    {/if}
</div>





<style>
    .container {
        height: 100%;
        width: 100%;

        display: grid;
        
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);

        grid-template-areas: 
            'a8 b8 c8 d8 e8 f8 g8 h8'
            'a7 b7 c7 d7 e7 f7 g7 h7'
            'a6 b6 c6 d6 e6 f6 g6 h6'
            'a5 b5 c5 d5 e5 f5 g5 h5'
            'a4 b4 c4 d4 e4 f4 g4 h4'
            'a3 b3 c3 d3 e3 f3 g3 h3'
            'a2 b2 c2 d2 e2 f2 g2 h2'
            'a1 b1 c1 d1 e1 f1 g1 h1'
        ;
    }

    .square {
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .square.light {
        background-color: #dddddd;
    }

    .square.dark {
        background-color: #999999;
    }

    .piece {
        height: 90%;
        max-width: 100%;
        object-fit: contain;
        object-position: center;
        cursor: pointer;
    }

    .move {
        height: 100%;
        width: 100%;
        
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .move img {
        height: 100%;
        width: 100%;

        object-fit: contain;
        object-position: center;
    }
</style>