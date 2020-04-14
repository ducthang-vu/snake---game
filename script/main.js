console.log('main.js is working')
console.log($)


class Snake {
    constructor() {
        this.head = [8, 5]
        this.tail = [[8, 4], [8, 3]]
    }

    moveSnake(array, boolean) {
        this.tail.unshift(this.head)
        this.head = [this.head[0] + array[0], this.head[1] + array[1]]
        if (boolean) this.tail.pop()
    }

    printCell(x, y, htmlClass) {
        $('.cell[data-x="' + x + '"][data-y="' + y + '"]').addClass(htmlClass)
    }   

    printSnake() {
        $('.cell').removeClass('snake-head snake-tail');
        this.printCell(this.head[0],  this.head[1], 'snake-head')
        
        this.tail.forEach(cell => {
            this.printCell(cell[0], cell[1], 'snake-tail')
        })
    }
}


class Game {
    constructor() {
        this.snake = new Snake
        this.score = 0
        this.level = 1
        this.board = 3
        this.apple = null
        this.nextMove = [0, 1]
    }

    //build_canvas(rows, columns)
    placeFood() {
        
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