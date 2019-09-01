class Scene {
    constructor(game) {
        this.game = game
        this.sceneName = ""
        this.elements = []
        this.init()
    }

    static new(game) {
        return new this(game)
    }

    init() {

    }

    addElement(elem) {
        this.elements.push(elem)
    }

    update() {
        for (var e of this.elements) {
            e.update()
        }
    }

    drawBackground() {
        var bg = this.game.imageByName("bg")
        this.game.drawImage(bg)
    }

    draw() {
        this.drawBackground()
        for (var e of this.elements) {
            e.draw()
        }
    }

    clear() {
        this.elements = this.elements.filter(e => e.exists)
    }
}

class GameScene extends Scene {
    constructor(game) {
        super(game)
        this.sceneName = "game"
    }

    init() {
        var enemyCount = config.enemy_count
        var yRange = enemyCount * 100
        for (var i = 0; i < enemyCount; i++) {
            var e = new Enemy(this.game, this.game.imageByName("enemy" + rangeBetween(0, 5)))
            e.y = Math.random() * yRange * (-1)
            this.addElement(e)
        }
        this.player = new Player(this.game, this.game.imageByName("player"))
        this.addElement(this.player)
        this.bulletCoolDownTime = 10
        this.bulletCoolDown = this.bulletCoolDownTime
    }

    borderCheck(elem) {
        if (elem instanceof Enemy) {
            if (elem.x <= 0 || elem.x + elem.width >= this.game.canvas.width) {
                elem.direction *= -1
            }
            if (elem.y >= this.game.canvas.height) {
                elem.exists = false
            }
        }
        if (elem instanceof Player) {
            if (elem.x < 0) {
                elem.x = 0
            }
            if (elem.y < 0) {
                elem.y = 0
            }
            if (elem.x + elem.width > this.game.canvas.width) {
                elem.x = this.game.canvas.width - elem.width
            }
            if (elem.y + elem.height >= this.game.canvas.height) {
                elem.y = this.game.canvas.height - elem.height
            }
        }
        if (elem instanceof Bullet) {
            if (elem.y + elem.height <= 0) {
                elem.exists = false
            }
        }
    }

    collision() {
        var len = this.elements.length
        for (var i = 0; i < len; i++) {
            var b = this.elements[i]
            if (b instanceof Bullet) {
                for (var j = 0; j < len; j++) {
                    var e = this.elements[j]
                    if (j != i
                        && e instanceof Enemy
                        && e.y + e.height > 0
                        && this.isSquareCollide(b.x, b.y, b.width, b.height, e.x, e.y, e.width, e.height)) {
                        b.exists = false
                        e.exists = false
                        this.explode(e.x + e.width / 2, e.y + e.height / 2)
                    }
                }
            }
        }
        var p = this.player
        for (var e of this.elements) {
            if (e instanceof Enemy
                && this.isSquareCollide(p.x, p.y, p.width, p.height, e.x, e.y, e.width, e.height)) {
                this.game.currentScene = "interface"
            }
        }
    }

    explode(x, y) {
        var images = []
        for (var i = 0; i < 3; i++) {
            images.push(this.game.imageByName("sparticle" + i))
        }
        var sp = new SparticleSystem(this.game, images, x, y)
        this.addElement(sp)
    }

    updateBullets() {
        if (this.bulletCoolDown > 0) {
            this.bulletCoolDown -= 1
        } else {
            var bullet = new Bullet(this.game, this.game.imageByName("bullet"))
            bullet.x = this.player.x + this.player.width / 2
            bullet.y = this.player.y - bullet.height
            this.addElement(bullet)
            this.bulletCoolDown = this.bulletCoolDownTime
        }
    }

    updateSparticles() {
        for (var e of this.elements) {
            if (e instanceof SparticleSystem) {
                if (e.sparticles.length == 0) {
                    e.exists = false
                }
            }
        }
    }

    update() {
        for (let e of this.elements) {
            e.update()
            this.borderCheck(e)
        }
        this.updateBullets()
        this.updateSparticles()
        this.collision()
        this.clear()
    }

    isSquareCollide(x1, y1, w1, h1, x2, y2, w2, h2) {
        var minX = x1 <= x2 ? x1 : x2
        var maxX = x1 + w1 <= x2 + w2 ? x2 + w2 : x1 + w1
        var minY = y1 <= y2 ? y1 : y2
        var maxY = y1 + h1 <= y2 + h2 ? y2 + h2 : y1 + h1
        return (maxX - minX <= w1 + w2) && (maxY - minY <= h1 + h2)
    }
}

class InterfaceScene extends Scene {
    constructor(game) {
        super(game)
        this.sceneName = "interface"
    }

    init() {
        this.startBtn = this.game.imageByName("startButton")
        this.startBtn.x = this.game.canvas.width / 2 - this.startBtn.width / 2
        this.startBtn.y = this.game.canvas.height / 2 - this.startBtn.height / 2
        this.setupActions()
    }

    setupActions() {
        var s = this
        s.game.canvas.addEventListener("click", function() {
            s.game.currentScene = "game"
        })
    }

    draw() {
        super.draw()
        this.game.drawImage(this.startBtn)
    }
}
