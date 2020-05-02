console.log('main.js is working')
console.log($)

/********************
* GLOBAL VARIABLES  *
********************/
const audio_bleep =  document.getElementById('audio-bleep')
const audio_defeat = document.getElementById('audio-defeat')
const audio_success = document.getElementById('audio-success')

const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')


/************************
* CLASSES and FUNCTIONS *
************************/

class Coord {
    static createRandom() {return new Coord(Math.random() * canvas.width | 0, Math.random() * canvas.height | 0)}

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
    static key_to_move = {w: 'up', d: 'right', a: 'left', s: 'down'}

    constructor() {
        self = this
        this.level = parseInt($('input[name="level"]').filter(':checked').attr('value'))
        this.snake = new Snake(Coord.createRandom())
        this.food = 0   //0: no food, 1: waiting to respawn, Coord(x,y): active at the coordinates
        this.score = 0
        this.timerId = null
    }

    enabling_Keyboard() {
        $(document).keydown(e => {
            if (Game.key_to_move[e.key]) this.snake.set_nextMove(Game.key_to_move[e.key])
        })
    }

    enabling_mouse() {
        function mouseMoving(e) {
            let canvasRect = canvas.getBoundingClientRect()
            let ratio = [canvasRect.width/canvas.width, canvasRect.height/canvas.height]

            let x = e.clientX - canvasRect.left
            let y = e.clientY - canvasRect.top
            
            let clickCoord = new Coord(x/ratio[0], y/ratio[1])

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


        canvas.addEventListener('click', mouseMoving)
    }

    addFood() {
        function createFood() {
            do {
                var nextFood = Coord.createRandom()
            }  while (self.snake.isIncluded(nextFood)) 
        
            self.food = nextFood
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
                self.startCycles()
            }
        } 

        $('#score-display').text(self.score)
    }

    startInvervals() {
        this.timerId = setInterval(self.cycle, (() => {
            return this.level ? Game.speed_per_score(this.score) : Game.speed_relax
        })())
    }

    stopInvervals() {
        clearInterval(self.timerId)
        self.timerId = null
    }

    startCycles() {
        self.addFood()
        self.startInvervals()
    }

    stopCycles() {
        self.food = 0
        audio_success.play()
        self.stopInvervals()
    }

    endgame() {
        self.stopCycles() 
        audio_defeat.play()
    }

    start() {
        this.level ? $('#mode-display').text('Normal') : $('#mode-display').text('Relax') 
        audio_bleep.play()
        this.enabling_Keyboard()
        this.enabling_mouse()
        this.startCycles()
    }
}


function resetAll() {
    resetAll.currentBest = null
    
    try {
        game.stopCycles()
        if (game.score > resetAll.currentBest) resetAll.currentBest = game.score

    } catch {}  //  if no game is active, do nothing

    if (resetAll.currentBest) $('#best-display').text(resetAll.currentBest)

    $('#score-display').text(0)
    c.clearRect(0, 0, canvas.width, canvas.height)
}


function activatePauseBtn() {
    try {
        if (game.timerId) {
            $('#pause-btn').addClass('resume').text('Resume')
            game.stopInvervals()
        } else {
            $('#pause-btn').removeClass('resume').text('Pause')
            game.startInvervals()
        } 
    } catch {}  //if no game is active, do nothing
}


function switchVolume() {
    Array.from($('audio')).forEach(audio => audio.muted = !audio.muted)
    
    $('#volume-btn').children().toggleClass('fa-volume-up fa-volume-mute')
}


function activateMainMenu(btnInfo, btnOptions, btnClose) {
    activateMainMenu.isActiveSubMenu = 0    //0 = none, 1 = Info, 2 = Options    

    function showInfoMenu() {
        $('#main-menu').addClass('active')

        activateMainMenu.isActiveSubMenu = 1
        $('#options-menu').removeClass('active')
        $('#info-menu').addClass('active')
    }

    function showOptionMenu() {
        $('#main-menu').addClass('active')

        activateMainMenu.isActiveSubMenu = 2
        $('#info-menu').removeClass('active')
        $('#options-menu').addClass('active')
    }

    function hideMainMenu() {
        $('#main-menu').removeClass('active')

        activateMainMenu.isActiveSubMenu = 0
        $('#info-menu').removeClass('active')
        $('#options-menu').removeClass('active')
    }

    function activateInfoBtn() {
        activateMainMenu.isActiveSubMenu != 1 ? showInfoMenu() : hideMainMenu()
    }

    function activateOtionBtn() {
        activateMainMenu.isActiveSubMenu != 2 ? showOptionMenu() : hideMainMenu()
    }

    btnInfo.click(activateInfoBtn)
    btnOptions.click(activateOtionBtn)
    btnClose.click(hideMainMenu)
}


/**************
* MAIN SCRITP *
**************/
activateMainMenu($('#info-btn'), $('#options-btn'), $('#close-menu-btn'))
$('#pause-btn').click(activatePauseBtn)
$('#volume-btn').click(switchVolume) 


$('#play-btn').click(()=> {
        resetAll()
        game = new Game
        game.start()
    }
)
