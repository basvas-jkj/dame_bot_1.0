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
    private _type: PIECE_TYPE;

    get row()
    {
        return this._row;
    }
    get column()
    {
        return this._column;
    }
    get type()
    {
        return this._type;
    }

    /* ---------------------------------
     * | Returns true if this piece is |
     * | man (either black or white).  |
     * ---------------------------------
     */
    get is_man()
    {
        return (this.type == PIECE_TYPE.white_man || this.type == PIECE_TYPE.black_man);
    }

    /* ---------------------------------
     * | Returns true if this piece is |
     * | white (either man or king).   |
     * ---------------------------------
     */
    get is_white()
    {
        return (this.type == PIECE_TYPE.white_man || this.type == PIECE_TYPE.white_king);
    }
    
    /* -------------------------------
     * | Returns true if this piece  |
     * | has different colour than   |
     * | piece given an an argument. |
     * -------------------------------
     */
    has_opposite_colour(piece: PIECE)
    {
        return (this.is_white != piece.is_white);
    }

    constructor(row: number, column: number, type: PIECE_TYPE)
    {
        this._type = type;
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
    }

    /* -------------------------
     * | Checks if the ongoing |
     * | move is possible.     |
     * -------------------------
     */
    is_possible_move(next_row: number, next_column: number)
    {
        if (this.type == PIECE_TYPE.white_man)
        {
            let valid_row = (next_row == this.row - 1);
            let valid_collumn = (next_column == this.column + 1 || next_column == this.column - 1)
            
            if (next_row == 0)
            {
                this._type = PIECE_TYPE.white_king;
            }

            return (valid_row && valid_collumn);
        }
        else if (this.type == PIECE_TYPE.black_man)
        {
            let valid_row = (next_row == this.row + 1);
            let valid_collumn = (next_column == this.column + 1 || next_column == this.column - 1)
            
            if (next_row == 7)
            {
                this._type = PIECE_TYPE.black_king;
            }
            
            return (valid_row && valid_collumn);
        }
        else if (this.row - this.column == next_row - next_column || this.row + this.column == next_row + next_column)
        {
            let row = this.row;
            let column = this.column;
            let row_change = (this.row < next_row) ? 1 : -1;
            let column_change = (this.column < next_column) ? 1 : -1;

            while (row != next_row)
            {
                row += row_change;
                column += column_change;
                
                if (BOARD.get_piece(row, column) != null)
                {
                    return false;
                }
            }
            return true;
        }
        else
        {
            return false;
        }
    }
}