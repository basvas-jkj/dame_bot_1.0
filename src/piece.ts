import * as BOARD from "./board";

import  "./svg/white_man.svg";
import "./svg/black_man.svg";
import "./svg/white_king.svg";
import "./svg/black_king.svg";

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

    get row(): number
    {
        return this._row;
    }
    get column(): number
    {
        return this._column;
    }
    get type(): PIECE_TYPE
    {
        return this._type;
    }

    /* ---------------------------------
     * | Returns true if this piece is |
     * | man (either black or white).  |
     * ---------------------------------
     */
    get is_man(): boolean
    {
        return (this.type == PIECE_TYPE.white_man || this.type == PIECE_TYPE.black_man);
    }

    /* ---------------------------------
     * | Returns true if this piece is |
     * | white (either man or king).   |
     * ---------------------------------
     */
    get is_white(): boolean
    {
        return (this.type == PIECE_TYPE.white_man || this.type == PIECE_TYPE.white_king);
    }

    /* ------------------------------------
     * | Returns graphical representation |
     * | of this piece in format svg.     |
     * ------------------------------------
     */
    get svg(): string
    {
        switch (this.type)
        {
            case PIECE_TYPE.white_man:
                return "<img src='./svg/white_man.svg'>";
            case PIECE_TYPE.black_man:
                return "<img src='./svg/black_man.svg'>";
            case PIECE_TYPE.white_king:
                return "<img src='./svg/white_king.svg'>";
            case PIECE_TYPE.black_king:
                return "<img src='./svg/black_king.svg'>";
            default:
                throw new Error("Unsupported type.");
        }
    }

    /* -------------------------------
     * | Returns true if this piece  |
     * | has different colour than   |
     * | piece given an an argument. |
     * -------------------------------
     */
    has_opposite_colour(piece: PIECE): boolean
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
    move(next_row: number, next_column: number): void
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
    is_possible_capture(next_row: number, next_column: number): PIECE | null
    {
        if (this.type == PIECE_TYPE.white_man)
        {
            if (next_row != this.row - 2)
            {
                return null;
            }
            else if (next_column == this.column + 2)
            {
                return BOARD.get_piece(this.row - 1, this.column + 1);
            }
            else if (next_column == this.column - 2)
            {
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
            let captured_piece: PIECE | null = null;

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

    /* -----------------------------------------
     * | Checks if this piece can be promoted  |
     * | to king (i.e. if it is a man standing |
     * | on the first or last layer).          |
     * -----------------------------------------
     */
    can_be_promoted(): boolean
    {
        return ((this.row == 0 && this.type == PIECE_TYPE.white_man) || (this.row == 7 && this.type == PIECE_TYPE.black_man));
    }

    /* ------------------------------------------------
     * | Promotes this man to a king of corresponding |
     * | colour. (change the type of piece in this    |
     * | class and on the gameboard)                  |
     * ------------------------------------------------
     */
    promote(): void
    {
        if (this.type == PIECE_TYPE.white_man)
        {
            this._type = PIECE_TYPE.white_king;
        }
        else if (this.type == PIECE_TYPE.black_man)
        {
            this._type = PIECE_TYPE.black_king;
        }

        let field = BOARD.get_field(this.row, this.column);
        field.square.html(this.svg);
    }

    /* -------------------------
     * | Checks if the ongoing |
     * | move is possible.     |
     * -------------------------
     */
    is_possible_move(next_row: number, next_column: number): boolean
    {
        if (this.type == PIECE_TYPE.white_man)
        {
            let valid_row = (next_row == this.row - 1);
            let valid_collumn = (next_column == this.column + 1 || next_column == this.column - 1)

            return (valid_row && valid_collumn);
        }
        else if (this.type == PIECE_TYPE.black_man)
        {
            let valid_row = (next_row == this.row + 1);
            let valid_collumn = (next_column == this.column + 1 || next_column == this.column - 1)

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

    /* -------------------------
     * | Checks if this king   |
     * | can capture any piece |
     * | of the other player.  |
     * -------------------------
     */
    private can_king_capture(captured_pieces: PIECE[]): boolean
    {
        const row = this.row;
        const column = this.column;
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
                else if (captured_pieces.includes(other_piece))
                {
                    break;
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
                else if (captured_pieces.includes(other_piece))
                {
                    break;
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
                else if (captured_pieces.includes(other_piece))
                {
                    break;
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
                else if (captured_pieces.includes(other_piece))
                {
                    break;
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

        return false;
    }

    /* -------------------------
     * | Checks if this man    |
     * | can capture any piece |
     * | of the other player.  |
     * -------------------------
     */
    private can_man_capture(): boolean
    {
        const row = this.row;
        const column = this.column;

        const direction = (this.is_white) ? -1 : 1;
        try
        {
            let piece_a = BOARD.get_piece(row + direction, column + 1);
            let piece_b = BOARD.get_piece(row + 2 * direction, column + 2);

            if (piece_b == null && piece_a!.has_opposite_colour(this))
            {
                return true
            }
        }
        catch {}
        try
        {
            let piece_a = BOARD.get_piece(row + direction, column - 1);
            let piece_b = BOARD.get_piece(row + 2 * direction, column - 2);

            if (piece_b == null && piece_a!.has_opposite_colour(this))
            {
                return true
            }
        }
        catch {};
        return false;
    }

    /* ----------------------------
     * | Checks if this piece can |
     * | capture any piece of the |
     * | other player.            |
     * ----------------------------
     */
    can_capture(captured_pieces: PIECE[] = [])
    {
        if (this.is_man)
        {
            return this.can_man_capture();
        }
        else
        {
            return this.can_king_capture(captured_pieces);
        }
    }

    /* ----------------------------
     * | Checks if this piece can |
     * | be captured by any piece |
     * | of the other player.     |
     * ----------------------------
     */
    is_threatened(): boolean
    {
        const row = this.row;
        const column = this.column;
        if (row == 0 || row == 7 || column == 0 || column == 7)
        {
            return false;
        }
        const direction = (this.is_white) ? -1 : 1;

        if (BOARD.get_piece(row - direction, column - 1) == null)
        {
            let r = row + direction;
            let c = column + 1;
            let other_piece = BOARD.get_piece(r, c);

            if (other_piece?.has_opposite_colour(this))
            {
                return true;
            }

            try
            {
                let second_piece = true;
                let has_opposite_colour = other_piece?.has_opposite_colour(this);
                while (has_opposite_colour == null || (!second_piece && !has_opposite_colour) || (has_opposite_colour && !other_piece?.is_man))
                {
                    if (has_opposite_colour && !other_piece?.is_man)
                    {
                        return true;
                    }
                    else if (has_opposite_colour != null && !has_opposite_colour)
                    {
                        second_piece = true;
                    }
                    else
                    {
                        second_piece = false;
                    }
                    r += direction;
                    c += 1;
                    other_piece = BOARD.get_piece(r, c);
                    has_opposite_colour = other_piece?.has_opposite_colour(this);
                }
            }
            catch {}
        }

        if (BOARD.get_piece(row - direction, column + 1) == null)
        {
            let r = row + direction;
            let c = column - 1;
            let other_piece = BOARD.get_piece(r, c);

            if (other_piece?.has_opposite_colour(this))
            {
                return true;
            }

            try
            {
                let second_piece = true;
                let has_opposite_colour = other_piece?.has_opposite_colour(this);
                while (has_opposite_colour == null || (!second_piece && !has_opposite_colour) || (has_opposite_colour && !other_piece?.is_man))
                {
                    if (has_opposite_colour && !other_piece?.is_man)
                    {
                        return true;
                    }
                    else if (has_opposite_colour != null && !has_opposite_colour)
                    {
                        second_piece = true;
                    }
                    else
                    {
                        second_piece = false;
                    }
                    r += direction;
                    c -= 1;
                    other_piece = BOARD.get_piece(r, c);
                    has_opposite_colour = other_piece?.has_opposite_colour(this);
                }
            }
            catch {}
        }

        if (BOARD.get_piece(row + direction, column - 1) == null)
        {
            let r = row - direction;
            let c = column + 1;
            let other_piece = BOARD.get_piece(r, c);
            try
            {
                let second_piece = true;
                let has_opposite_colour = other_piece?.has_opposite_colour(this);
                while (has_opposite_colour == null || (!second_piece && !has_opposite_colour) || (has_opposite_colour && !other_piece?.is_man))
                {
                    if (has_opposite_colour && !other_piece?.is_man)
                    {
                        return true;
                    }
                    else if (has_opposite_colour != null && !has_opposite_colour)
                    {
                        second_piece = true;
                    }
                    else
                    {
                        second_piece = false;
                    }
                    r -= direction;
                    c += 1;
                    other_piece = BOARD.get_piece(r, c);
                    has_opposite_colour = other_piece?.has_opposite_colour(this);
                }
            }
            catch {}
        }

        if (BOARD.get_piece(row + direction, column + 1) == null)
        {
            let r = row - direction;
            let c = column - 1;
            let other_piece = BOARD.get_piece(r, c);

            try
            {
                let second_piece = true;
                let has_opposite_colour = other_piece?.has_opposite_colour(this);
                while (has_opposite_colour == null || (!second_piece && !has_opposite_colour) || (has_opposite_colour && !other_piece?.is_man))
                {
                    if (has_opposite_colour && !other_piece?.is_man)
                    {
                        return true;
                    }
                    else if (has_opposite_colour != null && !has_opposite_colour)
                    {
                        second_piece = true;
                    }
                    else
                    {
                        second_piece = false;
                    }
                    r -= direction;
                    c -= 1;
                    other_piece = BOARD.get_piece(r, c);
                    has_opposite_colour = other_piece?.has_opposite_colour(this);
                }
            }
            catch {}
        }

        return false;
    }
}