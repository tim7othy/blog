class Scene {
    constructor(game) {
        this.game = game
        this.sceneName = ""
        this.elements = []
    }

    static new(game) {
        return new this(game)
    }

    addElement(elem) {
        this.elements.push(elem)
    }

    update() {
        for (var e of this.elements) {
            e.update()
        }
    }

    draw() {
        for (var e of this.elements) {
            e.draw()
        }
    }

    clear() {
        this.elements = this.elements.filter(e => e.exists)
    }

    isSquareCollide(x1, y1, w1, h1, x2, y2, w2, h2) {
        var minX = x1 <= x2 ? x1 : x2
        var maxX = x1 + w1 <= x2 + w2 ? x2 + w2 : x1 + w1
        var minY = y1 <= y2 ? y1 : y2
        var maxY = y1 + h1 <= y2 + h2 ? y2 + h2 : y1 + h1
        return (maxX - minX <= w1 + w2) && (maxY - minY <= h1 + h2)
    }
}

class GameScene extends Scene {
    constructor(game) {
        super(game)
        this.sceneName = "game"
        this.player = null
        this.pipes = null
        this.gameOver = false
        this.init()
    }

    init() {
        var g = this
        var skyBg = new Sky(g.game, g.game.imageByName("sky"))
        var landBg = new Land(g.game, g.game.imageByName("land"))
        g.pipes = new Pipes(g.game, g.game.imageByName("pipe"))
        g.player = new Player(g.game, g.game.imageByName("bird0"))

        g.addElement(skyBg)
        // pipe要比land先添加，否则会将一部分land覆盖
        g.addElement(g.pipes)
        g.addElement(landBg)
        g.addElement(g.player)
    }

    update() {
        super.update()
        this.collision()
        if (this.gameOver) {
            this.game.currentScene = "end"
        }
    }

    collision() {
        var ps = this.pipes
        var py = this.player
        for (var i = 0; i < ps.numPipes; i++) {
            var x = ps.pipesX[i]
            var y = ps.pipesH[i]
            var w = ps.pipeWidth
            var h = ps.pipeHeight
            var s = ps.pipeVerticleSpace
            if (this.isSquareCollide(py.x, py.y, py.width, py.height, x, y, w, h)
                || this.isSquareCollide(py.x, py.y, py.width, py.height, x, y + h + s, w, h)) {
                this.gameOver = true
            }
        }
    }
}

class EndScene extends Scene {
    constructor(game) {
        super(game)
        this.sceneName = "end"
    }

    draw() {
        var ctx = this.game.context
        var w = this.game.canvas.width
        var h = this.game.canvas.height
        ctx.font = "100px sans-serif"
        ctx.fillStyle = "#000"
        ctx.fillText("游戏结束", w / 2 - 200, h / 2 + 50)
    }
}
