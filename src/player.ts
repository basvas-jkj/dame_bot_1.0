import * as $ from "jquery";
import * as starting_position from "./starting_position.json";

import {PIECE, PIECE_TYPE} from "./piece";

export class PLAYER
{
    //  --------------------------------------------------------------------------------
    //  |                                static members                                |
    //  --------------------------------------------------------------------------------
    private static white: PLAYER;
    private static black: PLAYER;
    private static player_on_move: PLAYER;

    /* -----------------------------------
     * | Creates objects for black and   |
     * | white player, sets which player |
     * | is on move in the first turn.   |
     * -----------------------------------
     */
    static prepare()
    {
        PLAYER.white = new PLAYER("white", false);
        PLAYER.black = new PLAYER("black", true);

        if (starting_position.player_on_move == "white")
        {
        PLAYER.player_on_move = PLAYER.white;
        $("#player").text("white");
    }
        else
        {
            PLAYER.player_on_move = PLAYER.black;
            $("#player").text("black");
        }
    }

    /* -------------------------------------
     * | Checks if the piece passed as     |
     * | an argument belongs to the player |
     * | who is currently on the turn.     |
     * -------------------------------------
     */
    static is_players_piece(piece: PIECE_TYPE)
    {
        if (this.player_on_move == PLAYER.white)
        {
            return (piece == PIECE_TYPE.white_man || piece == PIECE_TYPE.white_king);
        }
        else
        {
            return (piece == PIECE_TYPE.black_man || piece == PIECE_TYPE.black_king);
        }
    }

    /* -----------------------------------------
     * | Checks if any piece of the player who |
     * | is currently on the turn can capture  |
     * | any piece of the other player.        |
     * -----------------------------------------
     */
    static can_capture()
    {
        for (const piece of this.player_on_move.pieces)
        {
            if (piece.can_capture())
            {
                return true;
            }
        }
        return false;
    }

    /* ------------------------
     * | Changes which player |
     * | is on the move.      |
     * ------------------------
     */
    static switch_players()
    {
        if (PLAYER.player_on_move == PLAYER.white)
        {
            PLAYER.player_on_move = PLAYER.black;
            $("#player").text("black");
        }
        else
        {
            PLAYER.player_on_move = PLAYER.white;
            $("#player").text("white");
        }
    }

    /* ------------------------------
     * | Remove captured piece      |
     * | (given as an argument)     |
     * | from pieces list of player |
     * | that is not on the move.   |
     * ------------------------------
     */
    static remove_piece(piece: PIECE)
    {
        let other_player = (PLAYER.player_on_move == PLAYER.white) ? PLAYER.black : PLAYER.white;
        let index = other_player.pieces.indexOf(piece);
        other_player.pieces.splice(index, 1);
    }

    //  --------------------------------------------------------------------------------
    //  |                               instance members                               |
    //  --------------------------------------------------------------------------------
    private readonly automatic: boolean;
    private readonly pieces: PIECE[];

    constructor(colour: "white" | "black", automatic: boolean)
    {
        this.automatic = automatic;

        this.pieces = [];
        for (const piece of starting_position[colour])
        {
            this.pieces.push(new PIECE(piece.row, piece.column, piece.type as PIECE_TYPE));
        }

        for (let i = 0; i < this.pieces.length; i += 1)
        {
            $(this.pieces[i]).on("end_of_move", PLAYER.switch_players);
        }
    }
}