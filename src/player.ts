import * as $ from "jquery";
import {PIECE, PIECE_TYPE} from "./piece";

export class PLAYER
{
    //  ----------------------
    //  |   static members   |
    //  ----------------------
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
        PLAYER.player_on_move = PLAYER.white;
        $("#player").text("white");
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

    //  ------------------------
    //  |   instance members   |
    //  ------------------------
    private readonly automatic: boolean;
    private readonly pieces: PIECE[];

    constructor(colour: "white" | "black", automatic: boolean)
    {
        this.automatic = automatic;
        if (colour == "white")
        {
            this.pieces = PIECE.prepare_for_white();
        }
        else
        {
            this.pieces = PIECE.prepare_for_black();
        }

        for (let i = 0; i < this.pieces.length; i += 1)
        {
            $(this.pieces[i]).on("end_of_move", PLAYER.switch_players);
        }
    }
}