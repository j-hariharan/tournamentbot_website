import { Chess } from "chess.js";

export default class ChessPlus extends Chess {
    
    constructor (params) {
        super(params)

        this._pointer = 0
        this._initial_state = new Map()

        this._boardstates = []

        this.SQUARES.map(s => {
            let p = this.get(s)

            if (p) {
                this._initial_state.set(s, {
                    pid: s,
                    type: p.type,
                    color: p.color,
                })
            }
            else {
                this._initial_state.set(s, false)
            }
        })

        this._boardstates.push(this._initial_state)

        // bindings
        this._move = this._move.bind(this)
        this._is_current = this._is_current.bind(this)
        this._undo = this._undo.bind(this)
        this._get_current_boardstate = this._get_current_boardstate.bind(this)
        this._moves = this._moves.bind(this)
        this._point = this._point.bind(this)
    }

    _move = function (m, pushChanges = true) {
        let move = this.move(m)

        if (!move) return this;

        if (pushChanges) {
            fetch('https://tournament-bott.herokuapp.com/chess/bgfvytfu/move'+m)
            .then(res => true)
        }


        let { from, to, flags } = move
        let last_board_state = this._boardstates[this._boardstates.length-1]
        let new_state = new Map(last_board_state)

        let piece = new_state.get(from)

        new_state.set(to, {...piece})
        new_state.set(from, false)

        switch (flags) {
            case 'n':
                break;
            case 'c':
                break;
            case 'b':
                break;
            case 'e':
                new_state.set(to[0] + from[1], false)
                break;
            case 'p':
                new_state.get(to).type = "q"
                break;
            case 'pc':
                new_state.get(to).type = "q"
                break;
        }

        this._boardstates.push(new_state)
        this._pointer = this._boardstates.length - 1

        return this;
    }

    _is_current = function () {
        return this._pointer == this._boardstates.length-1
    }

    _undo = function (s) {
        this.undo()
        this._boardstates.pop()

        if (this.turn() != s) {
            this.undo()
            this._boardstates.pop()
        }

        this._pointer = this._boardstates.length - 1

        return this;
    }

    _get_current_boardstate = function () {
        return this._boardstates[this._pointer]
    }

    _moves = function (square = false, verbose = true) {
        if (this._is_current())
            return square ? this.moves({ square, verbose }) : this.moves({ verbose })
        else return [];
    }

    _point = function (m) {
        if (m < this._boardstates.length)
            this._pointer = m
        return this;
    }

}

