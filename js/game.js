
// set config of game
let config = {
	type: Phaser.AUTO, // Will use webgl if avialable overwise it will use the canvas
	width: 640,
	height: 360,
	scene: [mainScene, resultScene],
	physics: {
		default: 'arcade',
		arcade: {
			debug: true
		}
	}
};

// create an new game and pass configuration to it
let game = new Phaser.Game(config);