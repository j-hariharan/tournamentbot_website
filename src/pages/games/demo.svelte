<script>
    import { engine, boardstate } from "./_chess/stores.js"
    import Board from "./_chess/board.svelte"
</script>


<div id="chessboard">
    <Board 
        boardstate = {$boardstate} 
        on:move = {(e) => engine.move(e.detail.move)}
    />
</div>

<style>
    #chessboard {
        width: 600px;
        height: 600px;
    }
</style>