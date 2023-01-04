import * as $ from "jquery";

import {PLAYER} from "./player";
import {PIECE, PIECE_TYPE} from "./piece";

type SQUARE = JQuery<HTMLElement>;
type FIELD = {square: SQUARE, piece: PIECE}
let fields: FIELD[][]; // rows × collums

//  -------------------------
//  |   helping functions   |
//  -------------------------

/* --------------------------
 * | Returns the row number |
 * | of the square.         |
 * --------------------------
 */
function row_of_square(square: SQUARE)
{
    return Number.parseInt(square.attr("id")[0]);
}

/* -------------------------
 * | Returns the column    |
 * | number of the square. |
 * -------------------------
 */
function column_of_square(square: SQUARE)
{
    return Number.parseInt(square.attr("id")[1]);
}

/* --------------------------------
 * | Returns field containing the |
 * | square given as an argument. |
 * --------------------------------
 */
function square_to_field(square: SQUARE)
{
    let row = row_of_square(square);
    let column = column_of_square(square);
    return fields[row][column];
}

/* -----------------------
 * | Invokes the move of |
 * | the chosen piece.   |
 * -----------------------
 */
function move_piece(from: SQUARE, to: SQUARE)
{
    const previous = square_to_field(from);
    const next = square_to_field(to);

    const next_row = row_of_square(to);
    const next_column = column_of_square(to);

    if (previous.piece.is_possible_move(next_row, next_column))
    {
        previous.piece.move(next_row, next_column);

        next.piece = previous.piece;
        previous.piece = null;
        from.html("");
        to.html(next.piece.type);
    
        PLAYER.switch_players();
    }
    else
    {
        throw new Error();
        }
}

/* --------------------------------
 * | Returns piece object located |
 * | in the row and the column,   |
 * | both given as arguments.          |
 * --------------------------------
 */
export function get_piece(row: number, column: number)
{
    if (row > 7 || row < 0 || column > 7 || column < 0)
    {
        throw new Error();
    }
    else
    {
        return fields[row][column].piece;
    }
}

//  --------------------
//  |   board events   |
//  --------------------
let moving = false;
let original_square: SQUARE = null;

/* --------------------------
 * | Unchecks marked piece. |
 * --------------------------
 */
function abort_move()
{
    original_square?.css("color", "rgb(255, 255, 255)")
    original_square = null;
    moving = false;
}

/* -----------------------------------
 * | If there is a marked piece and  |
 * | the clicked field is empty,     |
 * | executes the move. Otherwise,   |
 * | marks the chosen piece if there |
 * | is any on the click field.      |
 * -----------------------------------
 */
function black_click(this: HTMLElement)
{
    let clicked_square = $(this);
    if (moving)
    {
        if (clicked_square.html() == "")
        {
            try
            {
                move_piece(original_square, clicked_square);
                abort_move();
            }
            catch {}
        }
    }
    else if (PLAYER.is_players_piece(clicked_square.html() as PIECE_TYPE))
    {
        clicked_square.css("color", "rgb(255, 0, 0)");
        original_square = clicked_square;
        moving = true;
    }
}

//  --------------------------------
//  |   preparation of gameboard   |
//  --------------------------------

/* ---------------------------------
 * | Shows the piece passed as an  |
 * | argument in representation of |
 * | the appropriate field.        |
 * ---------------------------------
 */
export function place_piece(piece: PIECE)
{
    let field = fields[piece.row][piece.column]
    field.square.html(piece.type);
    field.piece = piece;
}

/* ---------------------
 * | Prepares the HTML |
 * | representation of |
 * | of the gameboard. |
 * ---------------------
 */
export function create()
{
    fields = new Array<FIELD[]>(8);

    for (let i = 0; i < 8; i += 1)
    {
        // i = number of row
        fields[i] = new Array<FIELD>(8);
        const row = $("<tr></tr>");
        for (let j = 0; j < 8; j += 1)
        {
            // j = number of column
            const square = $(`<td id=${i}${j}'></td>`);
            square.attr("width", 100);
            square.attr("height", 100);
            square.addClass(((i + j) % 2 == 0) ? "black" : "white");
            row.append(square);
            fields[i][j] = {square: square, piece: null};
        }
        $("#board").append(row);
    }

    $(".white").click(abort_move);
    $(".black").click(black_click);
    $("#board").mouseleave(abort_move);
}
