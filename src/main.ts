import * as $ from "jquery";
import * as BOARD from "./board";
import {PLAYER} from "./player";

/* -----------------------------------
 * | The entry point for the script. |
 * | Invokes the preparation of      |
 * | BOARD and PLAYER objects.       |
 * -----------------------------------
 */
function ready()
{
    BOARD.create();
    PLAYER.prepare();
}

$(ready);
