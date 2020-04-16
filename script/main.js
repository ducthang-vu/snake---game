console.log('main.js is working')
console.log($)


/* UTILITY FUNCTION */
function isEqualArray2(array1, array2) {
    if (array1.length != 2 || array2.length != 2) return -1
    return array1[0] == array2[0] && array1[1] == array2[1]
}


function ranCoord(a, b) {
    return [Math.floor(Math.random() * a), Math.floor(Math.random() * b)]
}


/* CLASSES */
class Snake {
    constructor() {
        this.head = [8, 5]
        this.tail = [[8, 4], [8, 3]]
        this.nextMove = [0, 1]
    }

    moveSnake(boolean=true) {
        this.tail.unshift(this.head)
        this.head = [this.head[0] + this.nextMove[0], this.head[1] + this.nextMove[1]]
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

    isInclude(array){
        if (isEqualArray2(array, this.head)) return true
        for (let i = 0; i < this.tail.length; i++) {
            if (isEqualArray2(array, this.tail[i])) return true
        }
        return false
    }
}


class Game {
    static boardSize() {return }

    constructor() {
        self = this
        this.snake = new Snake
        this.score = 0
        this.level = 1
        this.board = 3
        this.food = null
    }

    build_canvas(rows, columns) {
        // Buils the canvas for the game, by creating a <div> of class "canvas", and inside it (rows * columns) cells.
        // Each cell has special attributes "data-x" and "data-y" (column and row), being (rows - 1, 0) the first cell and (0, columns -1) the last.
        var content = '<div class="canvas">'
        for (let y = rows - 1; y >= 0; y--) {
            for (let x = 0; x < columns; x++)
                content += '<div class="cell" data-x="' + x + '" data-y="' + y + '"></div>'
        }
        board.html(content + '</div>')
    }

    addFood(a, b) {
        do {var food = ranCoord(a, b)} while (this.snake.isInclude(array))
        this.food = food   
    }

    enabling_Keyboard() {
        function keyboard(e) {
            switch (e.key) {
                case 'w' || 'ArrowUp':
                    self.snake.nextMove = [0, 1]
                    break
                case 'd' || 'ArrowRight':
                    self.snake.nextMove = [1, 0]
                    break
                case 'a' || 'ArrowLeft':
                    self.snake.nextMove = [-1 , 0]
                    break
                case 's' || 'ArrowDown':
                    self.snake.nextMove = [0, -1]
                    break
            }
        }

        $(document).keydown(keyboard)
    }
}





/***************************************/
/********* --- MAIN SCRITP --- *********/
/***************************************/

/* GLOBAL VARIABLE */
const board = $('#canvas-wrapper')


a = new Game
a.build_canvas(40, 80)




