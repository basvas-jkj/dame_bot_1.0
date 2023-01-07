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
    //  --------------------------------------------------------------------------------
    //  |                               instance members                               |
    //  --------------------------------------------------------------------------------
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

    /* ------------------------
     * | Changes the position |
     * | of this piece.       |
     * ------------------------
     */
    move(next_row: number, next_column: number)
    {
        this._row = next_row;
        this._column = next_column;
    }

    /* ----------------------------------
     * | Checks if the ongoing capture  |
     * | is possible. Returns the piece |
     * | which is going to be captured. |
     * ----------------------------------
     */
    is_possible_capture(next_row: number, next_column: number)
    {
        if (this.type == PIECE_TYPE.white_man)
        {
            if (next_row != this.row - 2)
            {
                return null;
            }
            else if (next_column == this.column + 2)
            {
                if (next_row == 0)
                {
                    this._type = PIECE_TYPE.white_king;
                }
                return BOARD.get_piece(this.row - 1, this.column + 1);
            }
            else if (next_column == this.column - 2)
            {
                if (next_row == 0)
                {
                    this._type = PIECE_TYPE.white_king;
                }
                return BOARD.get_piece(this.row - 1, this.column - 1);
            }
            else
            {
                return null;
            }
        }
        else if (this.type == PIECE_TYPE.black_man)
        {
            if (next_row != this.row + 2)
            {
                return null;
            }
            else if (next_column == this.column + 2)
            {
                if (next_row == 7)
                {
                    this._type = PIECE_TYPE.black_king;
                }
                return BOARD.get_piece(this.row + 1, this.column + 1);
            }
            else if (next_column == this.column - 2)
            {
                if (next_row == 7)
                {
                    this._type = PIECE_TYPE.black_king;
                }
                return BOARD.get_piece(this.row + 1, this.column - 1);
            }
            else
            {
                return null;
            }
        }
        else if (this.row - this.column == next_row - next_column || this.row + this.column == next_row + next_column)
        {
            let row = this.row;
            let column = this.column;
            let row_change = (this.row < next_row) ? 1 : -1;
            let column_change = (this.column < next_column) ? 1 : -1;
            let has_captured = false;
            let captured_piece: PIECE;

            while (row != next_row)
            {
                row += row_change;
                column += column_change;

                let other_piece = BOARD.get_piece(row, column);
                if (other_piece == null)
                {
                    continue;
                }
                else if (!has_captured && other_piece.has_opposite_colour(this))
                {
                    has_captured = true;
                    captured_piece = other_piece;
                }
                else
                {
                    return null;
                }
            }
            return captured_piece;
        }
        else
        {
            return null;
        }
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

    /* ----------------------------
     * | Checks if this piece can |
     * | capture any piece of the |
     * | other player.            |
     * ----------------------------
     */
    can_capture()
    {
        const row = this.row;
        const column = this.column;

        if (this.is_man)
        {
            const direction = (this.is_white) ? -1 : 1;
            try
            {
                let piece_a = BOARD.get_piece(row + direction, column + 1);
                let piece_b = BOARD.get_piece(row + 2 * direction, column + 2);

                if (piece_b == null && piece_a.has_opposite_colour(this))
                {
                    return true
                }
            }
            catch {}
            try
            {
                let piece_a = BOARD.get_piece(row + direction, column - 1);
                let piece_b = BOARD.get_piece(row + 2 * direction, column - 2);

                if (piece_b == null && piece_a.has_opposite_colour(this))
                {
                    return true
                }
            }
            catch {};
        }
        else
        {
            try
            {
                let next_row = row;
                let next_column = column;
                while (true)
                {
                    next_row += 1;
                    next_column += 1;
                    let other_piece = BOARD.get_piece(next_row, next_column);


                    if (other_piece == null)
                    {
                        continue;
                    }
                    else if (other_piece.has_opposite_colour(this) && BOARD.get_piece(next_row + 1, next_column + 1) == null)
                    {
                        return true;
                    }
                    else
                    {
                        break;
                    }
                }
            }
            catch {}
            try
            {
                let next_row = row;
                let next_column = column;
                while (true)
                {
                    next_row -= 1;
                    next_column += 1;
                    let other_piece = BOARD.get_piece(next_row, next_column);


                    if (other_piece == null)
                    {
                        continue;
                    }
                    else if (other_piece.has_opposite_colour(this) && BOARD.get_piece(next_row - 1, next_column + 1) == null)
                    {
                        return true;
                    }
                    else
                    {
                        break;
                    }
                }
            }
            catch {}
            try
            {
                let next_row = row;
                let next_column = column;
                while (true)
                {
                    next_row += 1;
                    next_column -= 1;
                    let other_piece = BOARD.get_piece(next_row, next_column);


                    if (other_piece == null)
                    {
                        continue;
                    }
                    else if (other_piece.has_opposite_colour(this) && BOARD.get_piece(next_row + 1, next_column - 1) == null)
                    {
                        return true;
                    }
                    else
                    {
                        break;
                    }
                }
            }
            catch {}
            try
            {
                let next_row = row;
                let next_column = column;
                while (true)
                {
                    next_row -= 1;
                    next_column -= 1;
                    let other_piece = BOARD.get_piece(next_row, next_column);


                    if (other_piece == null)
                    {
                        continue;
                    }
                    else if (other_piece.has_opposite_colour(this) && BOARD.get_piece(next_row - 1, next_column - 1) == null)
                    {
                        return true;
                    }
                    else
                    {
                        break;
                    }
                }
            }
            catch {}
        }
        return false;
    }
}