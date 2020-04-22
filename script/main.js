console.log('main.js is working')
console.log($)


/********************************************/
/********* --- GLOBAL VARIABLES --- *********/
/********************************************/
const audio_bleep =  document.getElementById('audio-bleep')
const audio_defeat = document.getElementById('audio-defeat')
const audio_success = document.getElementById('audio-success')

const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')

const icon_switch = $('#icon-switch')
const icon_volume = $('#icon-volume')
const info_button = $('#info-button')
const level_inputs = $('input[name="level"]')
const play_btn = $('#play-button')
const score_display = $('#score-display')
const mes_display = $('#messages')
const rules_box = $('#rules')
const volume_button = $('#volume-button')


/*************************************************/
/********* --- CLASSES and FUNCTIONS --- *********/
/*************************************************/

class Coord {
    static createRandom() {return new Coord(Math.random() * canvas.width | 0, Math.random() * canvas.height | 0)}

    // A class for essential  modelling of 2D vectors with basic methods for Snake game
    constructor(x, y) {
        if (x >= canvas.width) this.x = x - canvas.width
        else if (x < 0) this.x =  x + canvas.width 
        else this.x = x

        if (y >= canvas.height) this.y = y - canvas.height
        else if (y < 0) this.y = y + canvas.height 
        else this.y = y
    }

    isEqual(other) {
        return other instanceof Coord ? this.x == other.x && this.y == other.y : -1 
    }

    go(direction, n=1) {
        switch (direction) {
            case 'up': 
                return new Coord(this.x, this.y - n)

            case 'down': 
                return new Coord(this.x, this.y + n)

            case 'right': 
                return new Coord(this.x + n, this.y)

            case 'left': 
                return new Coord(this.x - n, this.y)

            default: 
                throw 'parameter "' + direction + '" is not "up", "down", "right" or "left".'
        }
    }
}


class Snake {
    constructor(head) {
        this.head = head
        this.tail = [this.head.go('down'), this.head.go('down', 2), this.head.go('down', 3), this.head.go('down', 4)]
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
    static speed_per_score(score) {return Math.max(60 - (score * 0.50), 10)}
    static speed_relax = 60

    constructor() {
        self = this
        this.level = level_inputs.filter(':checked').attr('value')
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

    enabling_mouse() {
        canvas.addEventListener('click', function(e) {
            var canvasRect = canvas.getBoundingClientRect()
            var ratio = [canvasRect.width/canvas.width, canvasRect.height/canvas.height]

            let x = e.clientX - canvasRect.left
            let y = e.clientY - canvasRect.top
            
            var clickCoord = new Coord(x/ratio[0], y/ratio[1])

            console.log(self.snake.head.x == self.snake.tail[1].x)
            //checking whether the snake is moving horizontally...
            if (self.snake.head.y == self.snake.tail[0].y) {
                if (clickCoord.y < self.snake.tail[0].y) {
                    self.snake.set_nextMove('up')
                } else if (clickCoord.y > self.snake.tail[0].y + 1) {
                    self.snake.set_nextMove('down')
                }
            } // or vertically
            else if (clickCoord.x < self.snake.tail[0].x) {
                    self.snake.set_nextMove('left')
                } else if (clickCoord.x > self.snake.tail[0].x + 1) {
                    self.snake.set_nextMove('right')
                }
            } 
        )
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
        var snakeMoveResult = self.snake.moveSnake(self.food) 
        if (snakeMoveResult == -1) self.endgame()   // player loses
        else {
            c.clearRect(0, 0, canvas.width, canvas.height)
            self.snake.printSnake()
            self.printFood()

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

        this.timerId = setInterval(self.cycle, (() => {
            return this.level? Game.speed_per_score(self.score) : Game.speed_relax
        })())
    }

    stopCycles() {
        self.food = 0
        audio_success.play()
        clearInterval(self.timerId)
    }

    endgame() {
        self.stopCycles() 
        audio_defeat.play()
        mes_display.html('GAME OVER!')
    }

    start() {
        audio_bleep.play()
        this.startCycles()
        this.enabling_Keyboard()
        this.enabling_mouse()
    }
}


function clearAll() {
    try {game.stopCycles()} catch {}
    score_display.html(0)
    c.clearRect(0, 0, canvas.width, canvas.height)
}


function showInfo() {
    rules_box.toggle()
    info_button.toggleClass('darkred-color')
    info_button.children().toggleClass('fa-question-circle fa-window-close')
} 


function switchVolume() {
    activeAudio = !activeAudio
    icon_volume.toggleClass('fa-volume-up fa-volume-mute')
    icon_switch.toggleClass('fa-toggle-on fa-toggle-off')
    icon_switch.toggleClass('darkgreen-color darkred-color')
}


/***************************************/
/********* --- MAIN SCRITP --- *********/
/***************************************/
var activeAudio = true


volume_button.click(switchVolume)
info_button.click(showInfo)

play_btn.click(()=> {
        clearAll()
        game = new Game
        game.start()
    }
)
