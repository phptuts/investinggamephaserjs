

// Copied from here 
// https://gomakethings.com/how-to-get-the-value-of-a-querystring-with-native-javascript/
let isDebugOn = function (  ) {
	var href =  window.location.href;
	var reg = new RegExp( '[?&]' + 'debug' + '=([^&#]*)', 'i' );
	var string = reg.exec(href);
	return string !== null && string.hasOwnProperty('1') && string[1] == '1';
};

// set config of game
let config = {
	type: Phaser.AUTO, // Will use webgl if avialable overwise it will use the canvas
	width: 640,
	height: 360,
	parent: 'phaser-canvas',
	scene: [mainScene, resultScene],
	physics: {
		default: 'arcade',
		arcade: {
			debug: isDebugOn()
		}
	}
};

// create an new game and pass configuration to it
let game = new Phaser.Game(config);