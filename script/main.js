console.log('main.js is working')
console.log($)


/*********/
/* CLASSES
/*********/

class Coord {
    static maxBoard = [40, 40]

    static createRandom() {return new Coord(Math.random() * Coord.maxBoard[0] | 0, Math.random() * Coord.maxBoard[1] | 0)}


    // A class for basic modelling of 2D vectors with basic methods for Snake game
    constructor(x, y) {
        if (x >= Coord.maxBoard[0]) this.x = x - Coord.maxBoard[0]
        else if (x < 0) this.x =  x + Coord.maxBoard[0]
        else this.x = x

        if (y >= Coord.maxBoard[1]) this.y = y - Coord.maxBoard[1]
        else if (y < 0) this.y = y + Coord.maxBoard[1] 
        else this.y = y
    }

    isEqual(other) {
        return other instanceof Coord ? this.x == other.x && this.y == other.y : -1 
    }

    go(direction) {
        switch (direction) {
            case 'up': 
                return new Coord(this.x, this.y - 1)

            case 'down': 
                return new Coord(this.x, this.y + 1)

            case 'right': 
                return new Coord(this.x + 1, this.y)

            case 'left': 
                return new Coord(this.x - 1, this.y)

            default: 
                throw 'parameter "' + direction + '" is not "up", "down", "right" or "left".'
        }
    }
}


class Snake {
    constructor(head) {
        this.head = head
        this.tail = [this.head.go('down'), this.head.go('down').go('down'), this.head.go('down').go('down').go('down')]
        this.nextMove = 'up'
    }

    set_nextMove(new_move) {
        if (this.head.go(new_move).isEqual(this.tail[0])) return false  //move illegal
        else {
            this.nextMove = new_move
            return true
        }
    }

    isIncluded(coord) {
        return this.tail.concat(this.head).some(x => x.isEqual(coord))
    }

    moveSnake(food=0) {
        if (this.isIncluded(this.head.go(this.nextMove))) return -1  //player loses

        this.tail.unshift(this.head)
        this.head = this.head.go(this.nextMove)

        if (food == 0 || food == 1 || !this.head.isEqual(food)) {   
            this.tail.pop()
            return 0    
        } else return 1     
    }

    printSnake() {
        c.fillStyle = '#8b0000'
        c.fillRect(this.head.x, this.head.y, 1, 1)
        for (let coord of this.tail) {
            c.fillStyle = '#ffff00'
            c.fillRect(coord.x, coord.y, 1, 1)
        } 
    }
}


class Game {
    static speed_per_score(score) {return 60 - score * 0.75}

    constructor() {
        self = this
        this.snake = new Snake(Coord.createRandom())
        this.food = 0   //0: no food, 1: waiting to respawn, Coord(x,y): active at the coordinates
        this.score = 0
        this.timerId
    }

    enabling_Keyboard() {
        function keyboard(e) {
            switch (e.key) {
                case 'w':
                    self.snake.set_nextMove('up')
                    break
                case 'd':
                    self.snake.set_nextMove('right')
                    break
                case 'a':
                    self.snake.set_nextMove('left')
                    break 
                case 's':
                    self.snake.set_nextMove('down')
                    break
            }
        }

        $(document).keydown(keyboard)
    }

    addFood() {
        function createFood() {
            do {
                var nextFood = Coord.createRandom()
            }  while (self.snake.isIncluded(nextFood)) 
        
            self.food = self.food = nextFood
        }
        
        self.food = 1
        setTimeout(createFood, 1000)
    }

    printFood() {
        c.fillStyle = '#00FF00'    //green
        c.fillRect(this.food.x, this.food.y, 1, 1)
    }

    cycle() {
        c.clearRect(0, 0, canvas.width, canvas.height)

        self.printFood()

        var snakeMoveResult = self.snake.moveSnake(self.food) 
        if (snakeMoveResult== -1) self.endgame()   
        else {
            self.snake.printSnake()
            if (snakeMoveResult == 1) {
                self.score++
                self.stopCycles() 
                self.startCycles(this.timerId)
            }
        } 

        score_display.html(self.score)
    }

    startCycles() {
        self.addFood()
        this.timerId = setInterval(self.cycle, Game.speed_per_score(self.score))
    }

    stopCycles() {
        self.food = 0
        clearInterval(self.timerId)
    }

    endgame() {
        self.stopCycles() 
        mes_display.html('GAME OVER!')
    }

    start() {
        this.startCycles()
        this.enabling_Keyboard()
    }
}


function clearAll() {
    try {game.stopCycles()} catch {}
    score_display.html(0)
    c.clearRect(0, 0, canvas.width, canvas.height)
}



/***************************************/
/********* --- MAIN SCRITP --- *********/
/***************************************/

/* GLOBAL VARIABLE */
const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')
const play_btn = $('#play-button')
const score_display = $('#score-display')
const mes_display = $('#messages')


play_btn.click(()=> {
        clearAll()
        game = new Game
        game.start()
    }
)
