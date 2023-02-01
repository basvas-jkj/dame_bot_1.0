import {PIECE} from "./piece";

export type SQUARE = JQuery<HTMLElement>;

export class FIELD
{
    /* --------------------------
     * | Returns the row number |
     * | of the square.         |
     * --------------------------
     */
    static row_of_square(square: SQUARE): number
    {
        return Number.parseInt(square.attr("id")![0]);
    }

    /* -------------------------
     * | Returns the column    |
     * | number of the square. |
     * -------------------------
     */
    static column_of_square(square: SQUARE): number
    {
        return Number.parseInt(square.attr("id")![1]);
    }

    readonly row: number;
    readonly column: number;
    readonly square: SQUARE;
    piece: PIECE | null;

    constructor(square: SQUARE)
    {
        this.square = square;
        this.row = FIELD.row_of_square(square);
        this.column = FIELD.column_of_square(square);

        this.piece = null;
    }
}