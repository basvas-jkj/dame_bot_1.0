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
    //  ----------------------
    //  |   static members   |
    //  ----------------------
    /* -----------------------------------
     * | Creates pieces for white player |
     * | and returns them as an array.   |
     * -----------------------------------
     */
    static prepare_for_white()
    {
        let pieces = new Array<PIECE>(0);
        for (let i = 0; i < 8; i += 2)
        {
            pieces.push(new PIECE(6, i, PIECE_TYPE.white_man));
        }
        for (let i = 1; i < 8; i += 2)
        {
            pieces.push(new PIECE(5, i, PIECE_TYPE.white_man));
            pieces.push(new PIECE(7, i, PIECE_TYPE.white_man));
        }
        return pieces;
    }
    /* -----------------------------------
     * | Creates pieces for black player |
     * | and returns them as an array.   |
     * -----------------------------------
     */
    static prepare_for_black()
    {
        let pieces = new Array<PIECE>(0);
        for (let i = 0; i < 8; i += 2)
        {
            pieces.push(new PIECE(0, i, PIECE_TYPE.black_man));
            pieces.push(new PIECE(2, i, PIECE_TYPE.black_man));
        }
        for (let i = 1; i < 8; i += 2)
        {
            pieces.push(new PIECE(1, i, PIECE_TYPE.black_man));
        }
        return pieces;
    }

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