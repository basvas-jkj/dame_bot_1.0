import {PIECE} from "./piece";
import {FIELD} from "./field";
import {get_field} from "./board";
import {EVALUATION} from "./next";

export class MOVE
{
    readonly from: FIELD;
    readonly to: FIELD;
    readonly evaluation: EVALUATION;
    readonly captured_pieces: PIECE[];
    readonly value_of_captured_pieces: number;
    readonly piece: PIECE;

    constructor(piece: PIECE, last_field: FIELD, evaluation: EVALUATION, captured_pieces: PIECE[] = [])
    {
        this.from = get_field(piece.row, piece.column);
        this.to = last_field;
        this.evaluation = evaluation;
        this.captured_pieces = captured_pieces;
        this.piece = piece;

        this.value_of_captured_pieces = 0;
        for (let piece of captured_pieces)
        {
            this.value_of_captured_pieces += (piece.is_man) ? 1 : 3;
        }
    }

    field_to_string(row: number, column: number): string
    {
        return `${String.fromCharCode("a".charCodeAt(0) + column)}${8 - row}`
    }

    to_string(): string
    {
        return this.piece.type + " " +
            this.field_to_string(this.from.row, this.from.column)
           + " > " + 
           this.field_to_string(this.to.row, this.to.column);
    }
}