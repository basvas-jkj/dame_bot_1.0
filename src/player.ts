import * as $ from "jquery";
import * as NEXT from "./next";
import * as BOARD from "./board";
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
        else
        {
            let found_move = false;
            let can_capture = PLAYER.player_on_move.can_capture();
            for (const piece of PLAYER.player_on_move.pieces)
            {
                let generator: Generator<MOVE, void, void>;
                if (piece.is_man)
                {
                    if (can_capture)
                    {
                        generator = NEXT.man_capture(piece, PLAYER.player_on_move.direction);
                    }
                    else
                    {
                        generator = NEXT.man_move(piece, PLAYER.player_on_move.direction);
                    }
                }
                else
                {
                    if (can_capture)
                    {
                        generator = NEXT.king_capture(piece);
                    }
                    else
                    {
                        generator = NEXT.king_move(piece);
                    }
                }

                let move = generator.next().value as MOVE;

                if (move != null)
                {
                    found_move = true;
                    break;
                }
            }
            if (!found_move)
            {
                if (PLAYER.player_on_move.direction == 1)
                {
                    $("p").html("<b>White wins.</b>");
                }
                else
                {
                    $("p").html("<b>Black wins.</b>");
                }
            }
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

    /* -------------------------
     * | Performs the move     |
     * | given as an argument. |
     * -------------------------
     */
    private perform_move(move: MOVE): void
    {
        BOARD.move_piece(move.from, move.to);
        for (let piece of move.captured_pieces)
        {
            BOARD.remove_piece(piece);
        }

        if (move.piece.can_be_promoted())
        {
            move.piece.promote();
        }
        PLAYER.switch_players();
    }

    /* --------------------------------
     * | Evaluates all possible moves |
     * | and chooses the best option. |
     * --------------------------------
     */
    private play(): void
    {
        let can_capture = this.can_capture();

        let chosen_moves = new Array<MOVE>();
        let max_evaluation: NEXT.EVALUATION = 0;
        let max_value_of_captured_pieces = 0;
        for (const piece of this.pieces)
        {
            let generator: Generator<MOVE, void, void>;
            if (piece.is_man)
            {
                if (can_capture)
                {
                    generator = NEXT.man_capture(piece, this.direction);
                }
                else
                {
                    generator = NEXT.man_move(piece, this.direction);
                }
            }
            else
            {
                if (can_capture)
                {
                    generator = NEXT.king_capture(piece);
                }
                else
                {
                    generator = NEXT.king_move(piece);
                }
            }     

            let move = generator.next().value as MOVE;

            while (move != null)
            {
                if (move.evaluation > max_evaluation || move.value_of_captured_pieces > max_value_of_captured_pieces)
                {
                    max_evaluation = move.evaluation;
                    max_value_of_captured_pieces = move.value_of_captured_pieces;
                    chosen_moves = [move];
                }
                else if (move.evaluation == max_evaluation && move.value_of_captured_pieces == max_value_of_captured_pieces)
                {
                    chosen_moves.push(move);
                }
                move = generator.next().value as MOVE;
            }
        }

        if (chosen_moves.length == 0)
        {
            if (this.direction == 1)
            {
                $("p").html("<b>White wins.</b>");
            }
            else
            {
                $("p").html("<b>Black wins.</b>");
            }
        }
        else
        {
            let random_number = Math.floor(Math.random() * chosen_moves.length); // random number between zero and chosen_moves.length - 1
            console.log(chosen_moves[random_number].to_string());
            this.perform_move(chosen_moves[random_number]);
        }
    }
}