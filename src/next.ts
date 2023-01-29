import {get_piece} from "./board";
import {MOVE, FIELD} from "./move";
import {PIECE} from "./piece";

/* --------------------------------------------
 * | Flag enum representing static evaluation |
 * | of the position at the end of the turn.  |
 * --------------------------------------------
 */
export enum EVALUATION
{
    is_threatened = 1,
    will_be_threatened = 2,
    promotion= 4,
    edge_of_board = 8
}

/* ------------------------------------------------
 * | Checks if the piece given as an argument     |
 * | will be threatened by enemy on the field     |
 * | given as arguments next_row and next_column. |
 * ------------------------------------------------
 */
function will_be_threatened(piece: PIECE, next_row: number, next_column: number)
{
    if (next_row == 0 || next_row == 7 || next_column == 0 || next_column == 7)
    {
        return false;
    }

    const direction = (piece.is_white) ? -1 : 1;
    
    if ([null, piece].includes(get_piece(next_row - direction, next_column - 1)))
    {
        let r = next_row + direction;
        let c = next_column + 1;
        let other_piece = get_piece(r, c);

        if (other_piece?.has_opposite_colour(piece))
        {
            return true;
        }

        try
        {
            let second_piece = true;
            let has_opposite_colour: boolean;
            if (r == piece.row && c == piece.column)
            {
                has_opposite_colour = null;
            }
            else
            {
                has_opposite_colour = other_piece?.has_opposite_colour(piece);
            }

            while (has_opposite_colour == null || (!second_piece && !has_opposite_colour) || (has_opposite_colour && !other_piece?.is_man))
            {
                if (has_opposite_colour && !other_piece?.is_man)
                {
                    return true;
                }
                else if (has_opposite_colour != null && !has_opposite_colour && other_piece != piece)
                {
                    second_piece = true;
                }
                else
                {
                    second_piece = false;
                }
                r += direction;
                c += 1;
                other_piece = get_piece(r, c);
                has_opposite_colour = other_piece?.has_opposite_colour(piece);
            }
        }
        catch {}
    }

    if ([null, piece].includes(get_piece(next_row - direction, next_column + 1)))
    {
        let r = next_row + direction;
        let c = next_column - 1;
        let other_piece = get_piece(r, c);

        if (other_piece?.has_opposite_colour(piece))
        {
            return true;
        }

        try
        {
            let second_piece = true;
            let has_opposite_colour: boolean;
            if (r == piece.row && c == piece.column)
            {
                has_opposite_colour = null;
            }
            else
            {
                has_opposite_colour = other_piece?.has_opposite_colour(piece);
            }

            while (has_opposite_colour == null || (!second_piece && !has_opposite_colour) || (has_opposite_colour && !other_piece?.is_man))
            {
                if (has_opposite_colour && !other_piece?.is_man)
                {
                    return true;
                }
                else if (has_opposite_colour != null &&!has_opposite_colour && piece != other_piece)
                {
                    second_piece = true;
                }
                else
                {
                    second_piece = false;
                }
                r += direction;
                c -= 1;
                other_piece = get_piece(r, c);
                has_opposite_colour = other_piece?.has_opposite_colour(piece);
            }
        }
        catch {}
    }

    if ([null, piece].includes(get_piece(next_row + direction, next_column - 1)))
    {
        let r = next_row - direction;
        let c = next_column + 1;
        let other_piece = get_piece(r, c);
        try
        {
            let second_piece = true;
            let has_opposite_colour: boolean;
            if (r == piece.row && c == piece.column)
            {
                has_opposite_colour = null;
            }
            else
            {
                has_opposite_colour = other_piece?.has_opposite_colour(piece);
            }

            while (has_opposite_colour == null || (!second_piece && !has_opposite_colour) || (has_opposite_colour && !other_piece?.is_man))
            {
                if (has_opposite_colour && !other_piece?.is_man)
                {
                    return true;
                }
                else if (has_opposite_colour != null && !has_opposite_colour && piece != other_piece)
                {
                    second_piece = true;
                }
                else
                {
                    second_piece = false;
                }
                r -= direction;
                c += 1;
                other_piece = get_piece(r, c);
                has_opposite_colour = other_piece?.has_opposite_colour(piece);
            }
        }
        catch {}
    }

    if ([null, piece].includes(get_piece(next_row + direction, next_column + 1)))
    {
        let r = next_row - direction;
        let c = next_column - 1;
        let other_piece = get_piece(r, c);

        try
        {
            let second_piece = true;
            let has_opposite_colour: boolean;
            if (r == piece.row && c == piece.column)
            {
                has_opposite_colour = null;
            }
            else
            {
                has_opposite_colour = other_piece?.has_opposite_colour(piece);
            }

            while (has_opposite_colour == null || (!second_piece && !has_opposite_colour) || (has_opposite_colour && !other_piece?.is_man))
            {
                if (has_opposite_colour && !other_piece?.is_man)
                {
                    return true;
                }
                else if (has_opposite_colour != null &&!has_opposite_colour && piece != other_piece)
                {
                    second_piece = true;
                }
                else
                {
                    second_piece = false;
                }
                r -= direction;
                c -= 1;
                other_piece = get_piece(r, c);
                has_opposite_colour = other_piece?.has_opposite_colour(piece);
            }
        }
        catch {}
    }

    return false;
}

/* -------------------------------
 * | Returns a static evaluation |
 * | of the position at the end  |
 * | of the turn.                |
 * -------------------------------
 */
function end_of_move_evaluation(piece: PIECE, next_row: number, next_column: number)
{
    let e: EVALUATION = 0;
    if ((next_row == 0 || next_row == 7) && piece.is_man)
    {
        e |= EVALUATION.promotion;
    }
    if (next_column == 0 || next_column == 7 || next_row == 0 || next_row == 7)
    {
        e |= EVALUATION.edge_of_board;
    }
    if (piece.is_threatened())
    {
        e |= EVALUATION.is_threatened;
    }
    if (will_be_threatened(piece, next_row, next_column))
    {
        e |= EVALUATION.will_be_threatened;
    }
    return e;
}

/* ----------------------------------
 * | Checks if the king given as an |
 * | argument is able to continue   |
 * | in move with another jump.     |
 * ----------------------------------
 */
function can_king_capture(piece: PIECE, row: number, column: number, row_direction: 1 | -1, column_direction: 1 | -1)
{
    try
    {
        let next_row = row;
        let next_column = column;
        while (true)
        {
            next_row += row_direction;
            next_column += column_direction;
            let other_piece = get_piece(next_row, next_column);


            if (other_piece == null)
            {
                continue;
            }
            else if (other_piece.has_opposite_colour(piece) && get_piece(next_row + row_direction, next_column + column_direction) == null)
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

/* --------------------------------------------
 * | Finds and returns all possible capturing |
 * | moves for king given as an argument in   |
 * | direction specified by parameters        |
 * | row_direction and column_direction       |
 * --------------------------------------------
 */
function *king_caputure_in_direction(piece: PIECE, row_direction: 1 | -1, column_direction: 1 | -1, fields: FIELD[] = []): Generator<MOVE, void, void>
{
    let row: number;
    let column: number;

    if (fields.length == 0)
    {
        row = piece.row;
        column = piece.column;
    }
    else
    {
        row = fields[fields.length - 1].row;
        column = fields[fields.length - 1].column;
    }

    let next_row = row + row_direction;
    let next_column = column + column_direction;
    let has_captured = false;
    let move_queue: FIELD[] = [];
    try
    {
        while (true)
        {
            let next_field = get_piece(next_row, next_column);
            if (next_field == null)
            {
                if (has_captured)
                {
                    const field: FIELD = {row: next_row, column: next_column};
                    let can_capture_1 = can_king_capture(piece, next_row, next_column, row_direction, -column_direction as 1 | -1);
                    let can_capture_2 = can_king_capture(piece, next_row, next_column, -row_direction as 1 | -1, column_direction);
                    
                    if (can_capture_1)
                    {
                        fields.push(field);
                        yield* king_caputure_in_direction(piece, row_direction, -column_direction as 1 | -1, fields);
                        fields.pop();
                    }
                    if (can_capture_2)
                    {
                        fields.push(field);
                        yield* king_caputure_in_direction(piece, -row_direction as 1 | -1, column_direction, fields);
                        fields.pop();
                    }
                    
                    if (!can_capture_1 && !can_capture_2)
                    {
                        move_queue.push(field);
                    }
                }
            }
            else if (next_field.has_opposite_colour(piece) && get_piece(next_row + row_direction, next_column + column_direction) == null)
            {
                if (has_captured)
                {
                    fields.push({row: next_row - row_direction, column: next_column - column_direction});
                    yield* king_caputure_in_direction(piece, row_direction, column_direction, fields);
                    fields.pop();
                    move_queue = [];
                    break;
                }
                else
                {
                    has_captured = true;
                }
            }
            else
            {
                break;
            }

            next_row += row_direction;
            next_column += column_direction;
        }
    }
    catch {}

    for (let move of move_queue)
    {
        let e = end_of_move_evaluation(piece, move.row, move.column);
        fields.push(move);
        yield new MOVE(piece, Object.assign(fields), e);
        fields.pop();
    }
}

/* ----------------------------------
 * | Finds and returns all possible |
 * | capturing moves for king given |
 * | as an argument.                |
 * ----------------------------------
 */
export function *king_capture(piece: PIECE): Generator<MOVE, void, void>
{
    yield *king_caputure_in_direction(piece, 1, 1);
    yield *king_caputure_in_direction(piece, -1, 1);
    yield *king_caputure_in_direction(piece, 1, -1);
    yield *king_caputure_in_direction(piece, -1, -1);
}

/* ----------------------------------
 * | Finds and returns all possible |
 * | capturing moves for man given  |
 * | as an argument.                |
 * ----------------------------------
 */
export function *man_capture(piece: PIECE, direction: 1 | -1, fields: FIELD[] = []): Generator<MOVE, void, void>
{
    let jumped_row: number;
    let next_row: number;
    let column: number;

    if (fields.length == 0)
    {
        jumped_row = piece.row + direction;
        next_row = piece.row + 2 * direction;
        column = piece.column;
    }
    else
    {
        jumped_row = fields[fields.length - 1].row + direction;
        next_row = fields[fields.length - 1].row + 2 * direction;
        column = fields[fields.length - 1].column;
    }
    
    let can_jump = false;
    let jumped_field: PIECE;
    let next_field: PIECE;

    if (column < 6 && next_row >= 0 && next_row <= 7)
    {
        jumped_field = get_piece(jumped_row, column + 1);
        next_field = get_piece(next_row, column + 2);
        if (jumped_field?.has_opposite_colour(piece) && next_field == null)
        {
            can_jump = true;
            fields.push({row: next_row, column: column + 2});
            yield* man_capture(piece, direction, fields);
            fields.pop();
        }
    }
    if (column > 1 && next_row >= 0 && next_row <= 7)
    {
        jumped_field = get_piece(jumped_row, column - 1);
        next_field = get_piece(next_row, column - 2);
        if (jumped_field?.has_opposite_colour(piece) && next_field == null)
        {
            can_jump = true;
            fields.push({row: next_row, column: column - 2});
            yield* man_capture(piece, direction, fields);
            fields.pop();
        }
    }

    if (!can_jump)
    {
        let e = end_of_move_evaluation(piece, fields[fields.length - 1].row, column);
        yield new MOVE(piece, Object.assign(fields), e);
    }
}

/* ---------------------------------------
 * | Finds and returns all possible      |
 * | moves for man given as an argument. |
 * ---------------------------------------
 */
export function* man_move(piece: PIECE, direction: 1 | -1)
{
    const column = piece.column;
    const next_row = piece.row + direction;
    let next_field: PIECE;

    if (column < 7)
    {
        next_field = get_piece(next_row, column + 1);
        if (next_field == null)
        {
            let e = end_of_move_evaluation(piece, next_row, column + 1);
            let field: FIELD = {row: next_row, column: column + 1};
            yield new MOVE(piece, [field], e);
        }
    }
    if (column > 0)
    {
        next_field = get_piece(next_row, column - 1);
        if (next_field == null)
        {
            let e = end_of_move_evaluation(piece, next_row, column - 1);
            let field: FIELD = {row: next_row, column: column - 1};
            yield new MOVE(piece, [field], e);
        }
    }
}

/* ---------------------------------------
 * | Finds and returns all possible      |
 * | moves for man given as an argument. |
 * ---------------------------------------
 */
export function *king_move(piece: PIECE)
{
    const row = piece.row;
    const column = piece.column;

    let next_field: PIECE;

    let next_row = row + 1;
    let next_column = column + 1;
    while (next_row <= 7 && next_column <= 7)
    {
        next_field = get_piece(next_row, next_column);
        if (next_field == null)
        {
            let e = end_of_move_evaluation(piece, next_row, next_column);
            let field: FIELD = {row: next_row, column: next_column};
            yield new MOVE(piece, [field], e);
        }
        else
        {
            break;
        }

        next_row += 1;
        next_column += 1;
    }
    
    next_row = row + 1;
    next_column = column - 1;
    while (next_row <= 7 && next_column >= 0)
    {
        next_field = get_piece(next_row, next_column);
        if (next_field == null)
        {
            let e = end_of_move_evaluation(piece, next_row, next_column);
            let field: FIELD = {row: next_row, column: next_column};
            yield new MOVE(piece, [field], e);
        }
        else
        {
            break;
        }

        next_row += 1;
        next_column -= 1;
    }

    next_row = row - 1;
    next_column = column + 1;
    while (next_row >= 0 && next_column <= 7)
    {
        next_field = get_piece(next_row, next_column);
        if (next_field == null)
        {
            let e = end_of_move_evaluation(piece, next_row, next_column);
            let field: FIELD = {row: next_row, column: next_column};
            yield new MOVE(piece, [field], e);
        }
        else
        {
            break;
        }

        next_row -= 1;
        next_column += 1;
    }

    next_row = row - 1;
    next_column = column - 1;
    while (next_row >= 0 && next_column >= 0)
    {
        next_field = get_piece(next_row, next_column);
        if (next_field == null)
        {
            let e = end_of_move_evaluation(piece, next_row, next_column);
            let field: FIELD = {row: next_row, column: next_column};
            yield new MOVE(piece, [field], e);
        }
        else
        {
            break;
        }

        next_row -= 1;
        next_column -= 1;
    }
}