var log = console.log.bind(console)

const config = {
    bullet_speed: 5,
    enemy_speed: 2,
    enemy_count: 50,
    player_speed: 5,
    sparticle_num: 50,
}

var rangeBetween = function(start, end) {
    return Math.floor((Math.random() * (end - start) + start))
}

var adjustSpeed = function(selector, callback) {
    var inputs = document.querySelectorAll(selector)
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("input", callback)
    }
}

var onDebugMode = function(flag) {
    if (flag) {
        adjustSpeed(".speed-adjust", function(event) {
            var input = event.target
            var variable = input.dataset.variable
            var value = input.value
            eval(variable + "=" + value)
            // 将输入条的当前值同步到span中显示出来
            var d = input.closest("div")
            d.querySelector("span").innerText = value
        })
    }
}
