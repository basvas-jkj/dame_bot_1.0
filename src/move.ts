import {PIECE} from "./piece";
import {EVALUATION} from "./next";

export type FIELD =
{
    readonly row: number;
    readonly column: number;
}

export class MOVE
{
    private piece: PIECE;
    private fields: FIELD[];
    private evaluation: EVALUATION;

    constructor(piece: PIECE, fields: FIELD[], evaluation: EVALUATION)
    {
        this.piece = piece;
        this.fields = fields;
        this.evaluation = evaluation;
    }

    field_to_string(row: number, column: number): string
    {
        return `${String.fromCharCode("a".charCodeAt(0) + column)}${8 - row}`
    }

    to_string(): string
    {
        let string = `${this.piece.type}: ${this.field_to_string(this.piece.row, this.piece.column)}`;
        for (let field of this.fields)
        {
            string += ` > ${this.field_to_string(field.row, field.column)}`
        }

        return string + ` (${this.evaluation})`;
    }
}