class Game {
    constructor(imgPaths) {
        window.fps = 50
        this.canvas = document.querySelector('#id-canvas')
        this.context = this.canvas.getContext('2d')
        this.imgPaths = imgPaths
        this.imgs = {}
        this.keydowns = {}
        this.actions = {}
        this.scene = null
        this.scenes = {
            "interface": InterfaceScene,
            "game": GameScene,
        }
        this.currentScene = "interface"

        var g = this
        window.addEventListener("keydown", function(event) {
            g.keydowns[event.key] = true
        })
        window.addEventListener("keyup", function(event) {
            g.keydowns[event.key] = false
        })
    }

    registerAction(key, callback) {
        this.actions[key] = callback
    }

    performActions() {
        var keys = Object.keys(this.actions)
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i]
            if (this.keydowns[k]) {
                this.actions[k]()
            }
        }
    }

    drawImage(image) {
        this.context.drawImage(image.img, image.x, image.y)
    }

    imageByName(name) {
        var img = this.imgs[name]
        return {
            x: 0,
            y: 0,
            width: img.width,
            height: img.height,
            img: img,
        }
    }

    init() {
        var g = this
        var imgNames = Object.keys(g.imgPaths)
        var numOfLoadedImgs = []
        for (var i = 0; i < imgNames.length; i++) {
            let name = imgNames[i]
            let img = new Image()
            img.src = g.imgPaths[name]
            img.onload = function() {
                g.imgs[name] = img
                numOfLoadedImgs.push(1)
                if (numOfLoadedImgs.length == imgNames.length) {
                    g.__start()
                }
            }
        }
    }

    runLoop() {
        var g = this
        g.performActions()
        g.update()
        g.clearCanvas()
        g.draw()
        setTimeout(function () {
            g.runLoop()
        }, 1000/window.fps)
    }

    update() {
        if (this.scene.sceneName != this.currentScene) {
            this.scene = this.scenes[this.currentScene].new(this)
        }
        this.scene.update()
    }

    draw() {
        this.scene.draw()
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    __start() {
        var scene = new InterfaceScene(this)
        this.scene = scene

        var g = this
        setTimeout(function () {
            g.runLoop()
        }, 1000/window.fps);
    }
}

var __main = function() {
	var prefix = "/blog/projects/plane-war/"
    imgPaths = {
        player: prefix + "img/player.png",
        enemy0: prefix + "img/enemy0.png",
        enemy1: prefix + "img/enemy1.png",
        enemy2: prefix + "img/enemy2.png",
        enemy3: prefix + "img/enemy3.png",
        enemy4: prefix + "img/enemy4.png",
        bullet: prefix + "img/bullet.png",
        sparticle0: prefix + "img/sparticle0.png",
        sparticle1: prefix + "img/sparticle1.png",
        sparticle2: prefix + "img/sparticle2.png",
        bg: prefix + "img/bg.jpg",
        startButton: prefix + "img/start.png",
    }
    onDebugMode(true)
    var game = new Game(imgPaths)
    game.init()
}

__main()
