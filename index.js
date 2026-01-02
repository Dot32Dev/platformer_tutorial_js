const WIDTH = 800
const HEIGHT = 600

let player = {
	x: WIDTH/2 - 20,
	y: HEIGHT/2 - 20,
	xV: 0,
	yV: 0,
	width: 40,
	height: 40,
	draw() {
		ctx.fillStyle = "white"
		ctx.fillRect(this.x, this.y, this.width, this.height)
	},
	previous() {
		return {
			x: this.x - this.xV,
			y: this.y - this.yV,
			width: this.width,
			height: this.height
		}
	}
}

let platforms = []
function new_platform(x, y, width, height) {
	return {
		x,
		y,
		width,
		height,
		draw() {
			ctx.fillStyle = "#666666"
			ctx.fillRect(this.x, this.y, this.width, this.height)
		}
	}
}
platforms.push(new_platform(0, 450, 800, 150))
platforms.push(new_platform(0, 350, 300, 100))
platforms.push(new_platform(400, 350, 200, 30))
platforms.push(new_platform(500, 250, 100, 60))

game.width = WIDTH
game.height = HEIGHT
const ctx = game.getContext("2d")
console.log(ctx)

function clear() {
	ctx.fillStyle = "black"
	ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

const keys = {};

window.addEventListener('keydown', function(event) {
    keys[event.key] = true; 
});

window.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

function aabb_x_check(player, platform) {
	return player.x + player.width > platform.x
	&& player.x < platform.x + platform.width
}
function aabb_y_check(player, platform) {
	return player.y + player.height > platform.y
	&& player.y < platform.y + platform.height
}

function update() {
	if (keys["ArrowRight"]) {
		player.xV += 0.5
	}	
	if (keys["ArrowLeft"]) {
		player.xV -= 0.5
	}
	player.xV = player.xV * 0.9

	// Update the player's position
	player.x += player.xV
	player.y += player.yV

	player.yV += 0.2

	for (const platform of platforms) {
		if (aabb_x_check(player, platform) && aabb_y_check(player, platform)) {
			if (aabb_x_check(player.previous(), platform)) {
				// Resolving on the Y axis
                if (player.yV > 0) {
                    player.y = platform.y - player.height
                    player.yV = 0
                    if (keys["ArrowUp"]) {
                        player.yV = -7
                    }
                } else {
                    player.y = platform.y + platform.height
                    player.yV = 0
                }
			} else if (aabb_y_check(player.previous(), platform)) {
                if (player.xV > 0) {
                    player.x = platform.x - player.width
                    player.xV = 0
                } else {
                    player.x = platform.x + platform.width
                    player.xV = 0
                }
            }
		}
	}
}

function draw() {
    clear()
	for (const platform of platforms) {
		platform.draw()
    }
    player.draw()
}

const FPS = 120;
let prev_timestamp;
let accumulator = 0;

function frame(curr_timestamp) {
    requestAnimationFrame(frame)

    if (prev_timestamp === undefined) {
        prev_timestamp = curr_timestamp
    }
    // Deltatime in miliseconds
    const delta_time = curr_timestamp - prev_timestamp
    prev_timestamp = curr_timestamp
    accumulator += delta_time

    while (accumulator > 1000 / FPS) {
        update()
        draw()
        accumulator -= 1000 / FPS
    }
}

requestAnimationFrame(frame)
