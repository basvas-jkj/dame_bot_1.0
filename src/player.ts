import * as $ from "jquery";
import * as NEXT from "./next";
import * as starting_position from "./starting_position.json";

import {MOVE} from "./move";
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
    static prepare(): void
    {
        PLAYER.white = new PLAYER("white", true);
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

        if (PLAYER.player_on_move.automatic)
        {
            PLAYER.player_on_move.play();
        }
    }

    /* -------------------------------------
     * | Checks if the piece passed as     |
     * | an argument belongs to the player |
     * | who is currently on the turn.     |
     * -------------------------------------
     */
    static is_players_piece(piece: PIECE_TYPE): boolean
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
    static can_capture(): boolean
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
    static switch_players(): void
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

        if (PLAYER.player_on_move.automatic)
        {
            PLAYER.player_on_move.play();
        }
    }

    /* ------------------------------
     * | Remove captured piece      |
     * | (given as an argument)     |
     * | from pieces list of player |
     * | that is not on the move.   |
     * ------------------------------
     */
    static remove_piece(piece: PIECE): void
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
    private readonly direction: 1 | -1; // Indicates, whether this player's piece should be moved forward or backward.

    constructor(colour: "white" | "black", automatic: boolean)
    {
        this.automatic = automatic;

        this.pieces = [];
        for (const piece of starting_position[colour])
        {
            this.pieces.push(new PIECE(piece.row, piece.column, piece.type as PIECE_TYPE));
        }

        this.direction = (colour == "white") ? -1 : 1; // Compared to the regular game, the lines are numbered in reverse order.
    }

    /* ----------------------------
     * | Checks if the player can |
     * | capture any piece of the |
     * | other player.            |
     * ----------------------------
     */
    private can_capture(): boolean
    {
        for (let piece of this.pieces)
        {
            if (piece.can_capture())
            {
                return true;
            }
        }
        return false;
    }

    /* --------------------------------
     * | Evaluates all possible moves |
     * | and chooses the best option. |
     * --------------------------------
     */
    private play(): void
    {
        let can_capture = this.can_capture();
        let number_of_threatened_men = 0;
        let number_of_threatened_kings = 0;
        for (const piece of this.pieces)
        {
            if (piece.is_threatened())
            {
                (piece.is_man) ? number_of_threatened_men += 1 : number_of_threatened_kings += 1;
            }
        }
        console.clear();
        console.log("Počet ohrožených kamenů: %d", number_of_threatened_men);
        console.log("Počet ohrožených dam: %d", number_of_threatened_kings);
        console.log((can_capture) ? "Hráč může brát." : "Hráč nemůže brát.");

        for (const piece of this.pieces)
        {
            let gen: Generator<MOVE, void, void>;
            if (piece.is_man)
            {
                if (can_capture)
                {
                    gen = NEXT.man_capture(piece, this.direction);
                }
                else
                {
                    gen = NEXT.man_move(piece, this.direction);
                }
            }
            else
            {
                if (can_capture)
                {
                    gen = NEXT.king_capture(piece);
                }
                else
                {
                    gen = NEXT.king_move(piece);
                }
            }

            let move = gen.next().value as MOVE;
            while (move != null)
            {
                console.log(move.to_string());
                move = gen.next().value as MOVE;
            }
        }
    }
}