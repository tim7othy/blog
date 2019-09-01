class Background {
    constructor(game, image) {
        this.game = game
        this.image = image
    }

    update() {

    }

    draw() {
        this.game.drawImage(this.image)
    }
}

class Sky extends Background {
    constructor(game, image) {
        super(game, image)
    }
}

class Land extends Background {
    constructor(game, image) {
        super(game, image)
        this.firstLandX = 0
    }

    update() {
        if (this.firstLandX > -336) {
            this.firstLandX -= 10
        } else {
            this.firstLandX = 0
        }
    }

    draw() {
        // 循环绘制地面，制作位移效果
        var land = this.image
        var landX = this.firstLandX
        for (var i = 0; i < 4; i++) {
            land.x = landX
            land.y = 500
            this.game.drawImage(land)
            landX += 336
        }
    }
}
