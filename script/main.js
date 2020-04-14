console.log('main.js is working')
console.log($)



class Game {
    constructor() {
        this.snake
        this.score = 0
        this.level = 1
        this.board = 3
        this.apple = null
    }
}

function build_canvas(rows, columns) {
    // Buils the canvas for the game, by creating a <div> of class "canvas", and inside it (rows * columns) cells.
    // Each cell has special attributes "data-x" and "data-y" (column and row), being (rows - 1, 0) the first cell and (0, columns -1) the last.
    var content = '<div class="canvas">'
    for (let y = rows - 1; y >= 0; y--) {
        for (let x = 0; x < columns; x++)
            content += '<div class="cell" data-x="' + x + '" data-y="' + y + '"></div>'
    }
    board.html(content + '</div>')
}



/***************************************/
/********* --- MAIN SCRITP --- *********/
/***************************************/

/* GLOBAL VARIABLE */
const board = $('#canvas-wrapper')
build_canvas(40, 80)