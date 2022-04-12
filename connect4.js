/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = Array(HEIGHT); // array of rows, each row is array of cells  (board[y][x])
let gameOver = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {
    board[y] = Array(WIDTH);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.querySelector("#board");
  // TODO: add comment for this code
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  fillCells(top);
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    fillCells(row, y);
    htmlBoard.append(row);
  }
}

function fillCells(row, rowIndex = -1) {
  for (let cellIndex = 0; cellIndex < WIDTH; cellIndex++) {
    let cell = document.createElement("td");
    cell.setAttribute("id", `${rowIndex}-${cellIndex}`);
    cell.setAttribute("data-x", `${cellIndex}`);
    row.append(cell);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let rowIndex = HEIGHT - 1; rowIndex >= 0; rowIndex--){
    if (board[rowIndex][x] == null) {
      return rowIndex;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let divPiece = document.createElement("div");
  divPiece.classList.add("piece", `player${currPlayer}`);
  document.getElementById(`${y}-${x}`).append(divPiece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  gameOver = true;
  setTimeout(() => { alert(msg) }, 500);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (gameOver) {
    return;
  }

  // get x from data-attribute of clicked cell
  // note: edited from original version, where x came from the ID
  let x = evt.target.getAttribute("data-x");

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (y === 0 && checkForTie()) {
    endGame(`Tie Game!`);
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  togglePlayerNumber();
}

function togglePlayerNumber() {
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/* This method of checking for a tie was used to satisfy the given constraints:
  - The board nested array was to be initialized as an empty array, as per:
      'set "board" to empty HEIGHT x WIDTH matrix array'
  - The checkForTie function should use the .every() method of arrays, as per:
      'add a check for “is the entire board filled” 
      [hint: the JS every method on arrays would be especially nice here!]'
  - The .every() method does not execute on empty elements
*/
function checkForTie() {
  return board.every((row) => {
    return row.join("").length === WIDTH;
  });
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //horiz groups 4 cells horizontally to the right
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      //vert groups 4 cells vertically, moving down the column
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      //diagDR groups 4 cells diagonally, moving down and right
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      //diagDL groups 4 cells diagonally, moving down and left
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      /* since _win checks that the cell groups are legal coordinates,
      it ultimately doesn't matter that some of the group x,y values 
      extend beyond the board - those will be ruled out. Instead,
      if any cell groups are all placed by the same active player, 
      that player wins.
      */
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
