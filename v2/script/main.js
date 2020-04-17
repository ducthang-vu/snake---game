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


function sumCoord(array1, array2) {
    return [array1[0] + array2[0], array1[1] + array2[1]]
}


/* CLASSES */
class Snake {
    constructor(array) {
        this.head = array[0]  
        this.tail = array.slice(1)
        this.nextMove = [0, 10] // Should be random?
        this.tail_deleted
    }

    printSnake() {
        c.fillStyle = '#8b0000'
        c.fillRect(this.head[0], this.head[1], Game.cellSize(), Game.cellSize())
        for (let coord of this.tail) {
            c.fillStyle = '#ffff00'
            c.fillRect(coord[0], coord[1], Game.cellSize(), Game.cellSize())
        } 
    }

    setNextMove(array) {
        //Head cannot move backwards
        if (isEqualArray2(sumCoord(this.head, array), this.tail[0])) {
            return false
        } 
        else {
            this.nextMove = array
            return true
        }
    }

    moveSnake(foodGrowth=false) {
        var nextHead = sumCoord(this.head, this.nextMove)

        if (nextHead[0] >= 800) nextHead[0] = 0
        if (nextHead[0] < 0) nextHead[0] = Game.maxBoard()[0] - Game.cellSize()
        if (nextHead[1] >= 400) nextHead[1] = 0
        if (nextHead[1] < 0) nextHead[1] = Game.maxBoard()[1] - Game.cellSize()

        if (this.tail.some(x => isEqualArray2(x, nextHead))) {return false} //Game over!
        else {
            this.tail.unshift(this.head)
            this.head = nextHead
        }

        if (!foodGrowth) this.tail_deleted = this.tail.pop()

        return true
    }
}


class Food {
    constructor(array) {
        this.currentFood = [array]
        this.timerId = []
    }

    printFood() {
        c.fillStyle = '#fff'
        c.fillRect(currentFood[0], currentFood[1], Game.cellSize(), Game.cellSize())
    }
}


class Game {
    static maxBoard() {return [800, 400]}
    static cellSize() {return 10}

    constructor() {
        self = this
        this.snake = new Snake([[30, 10], [20, 10], [10, 10]])
        this.food = null
        this.score = 0
        this.timerId
    }

    enabling_Keyboard() {
        function keyboard(e) {
            switch (e.key) {
                case 'w' || 'ArrowUp':
                    self.snake.setNextMove([0, -10])
                    break
                case 'd' || 'ArrowRight':
                    self.snake.setNextMove([10, 0])
                    break
                case 'a' || 'ArrowLeft':
                    self.snake.setNextMove([-10, 0])
                    break
                case 's' || 'ArrowDown':
                    self.snake.setNextMove([0, 10])
                    break
            }
        }

        $(document).keydown(keyboard)
    }

    addFood() {
        do {
            var nextFood = [Math.random() * Game.maxBoard()[0] | 0, Math.random() * Game.maxBoard()[1] | 0]
        }  while (self.snake.tail.some(x => isEqualArray2(x, nextFood)))
        self.food = new Food(nextFood)
    }


    cycle() {
        if (self.snake.moveSnake()) {
            c.clearRect(self.snake.tail_deleted[0], self.snake.tail_deleted[1], 10, 10)
            self.snake.printSnake()
        } else {
            alert('Game over!')
        }

        if (!this.food) {
            setTimeout(self.addFood, 2000)
        }
    }

    startCycles() {
        this.timerId = setInterval(self.cycle, 500)
    }

    stopCycles() {
        clearInterval(this.timerId)
    }

    start() {
        this.snake.printSnake()
        this.enabling_Keyboard()
        this.startCycles()
    }
}


function clearAll() {
    try {game.stopCycles()} catch {}
    c.clearRect(0, 0, canvas.width, canvas.height)
}

/***************************************/
/********* --- MAIN SCRITP --- *********/
/***************************************/

/* GLOBAL VARIABLE */
const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')
const play_btn = $('#play-button')


play_btn.click(()=> {
        clearAll()
        game = new Game
        game.start()
    }
)





