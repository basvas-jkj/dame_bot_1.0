import * as $ from "jquery";
import * as BOARD from "./board";

/* ---------------------------------
 * | Represents the type of piece. |
 * ---------------------------------
 */
export enum PIECE_TYPE
{
    white_man = "white",
    black_man = "black",
    white_king = "WHITE",
    black_king = "BLACK"
}

export class PIECE
{
    //  ------------------------
    //  |   instance members   |
    //  ------------------------
    private _row: number;
    private _column: number;

    get row()
    {
        return this._row;
    }
    get column()
    {
        return this._column;
    }

    readonly type: PIECE_TYPE;
    constructor(row: number, column: number, type: PIECE_TYPE)
    {
        this.type = type;
        this._row = row;
        this._column = column;

        BOARD.place_piece(this);
    }

    /* ---------------------
     * | Moves this piece  |
     * | to another field. |
     * ---------------------
     */
    move(next_row: number, next_column: number)
    {
        this._row = next_row;
        this._column = next_column;
        $(this).trigger("end_of_move");
    }
}