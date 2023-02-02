import {PIECE} from "./piece";
import {FIELD} from "./field";
import {get_field} from "./board";
import {EVALUATION} from "./next";

export class MOVE
{
    readonly fields: FIELD[];
    readonly evaluation: EVALUATION;
    readonly captured_pieces: PIECE[];
    readonly value_of_captured_pieces: number;
    readonly piece: PIECE;

    get from(): FIELD
    {
        return get_field(this.piece.row, this.piece.column);
    }
    get to(): FIELD
    {
        return this.fields[this.fields.length - 1];
    }

    constructor(piece: PIECE, fields: FIELD[], evaluation: EVALUATION, captured_pieces: PIECE[] = [])
    {
        this.fields = fields;
        this.evaluation = evaluation;
        this.captured_pieces = captured_pieces;
        this.piece = piece;

        this.value_of_captured_pieces = 0;
        for (let piece of captured_pieces)
        {
            this.value_of_captured_pieces += (piece.is_man) ? 1 : 3;
        }
    }

    /* -------------------------------------
     * | Marks all fields which are part   |
     * | of the move the bot wants to make.|
     * -------------------------------------
     */
    mark(): void
    {
        this.from.square.css("background-color", "rgb(0, 255, 255)");
        for (let field of this.fields)
        {
            field.square.css("background-color", "rgb(0, 255, 255)");
        }
    }

    /* -------------------------------------
     * | Unmarks all fields which are part |
     * | of the move the bot wants to make.|
     * -------------------------------------
     */
    unmark(): void
    {
        this.from.square.css("background-color", "rgb(0, 0, 0)");
        for (let field of this.fields)
        {
            field.square.css("background-color", "rgb(0, 0, 0)");
        }
    }

    /* ---------------------------------
     * | Returns string representation |
     * | of this move.                 |
     * ---------------------------------
     */
    to_string(): string
    {
        let string: string = this.piece.type + ": " + this.from.to_string();
        for (let field of this.fields)
        {
            string += " > " + field.to_string();
        }
        return string;
    }
}