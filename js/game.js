let gameScene = new Phaser.Scene('Game');

let oneRadian = Math.PI / 180;

// Runs first and is used to set all the variables
gameScene.init = function() {
	this.moneyYears = []; // The number of money invested in that year
	this.interestRate = .09; // Assuming 9% interest rate
	this.moneyDistanceFromCannon = -92;
};

// Runs second and is used to set all the images used in the game
gameScene.preload = function() {
	this.load.image('background', 'images/background.jpg');
	this.load.image('pig', 'images/pig.png');
	this.load.image('cannon', 'images/cannon.png');
	this.load.image('creditcard', 'images/creditcard.png');
	this.load.image('car', 'images/car.png');
	this.load.image('eatingout', 'images/eatingout.png');
	this.load.image('moneybag', 'images/money.png');
};

// Runs third and is used to position all the images initially in the game
gameScene.create = function() {
	
	// positions the background
	let bg = this.add.sprite(0,0, 'background');
	bg.setOrigin(0,0);
	
	// position the pig
	this.pig = this.add.sprite(50, 200, 'pig');
	this.pig.setScale(.2);
	
	// position the cannon and change origin so it rotates around the wheels
	this.cannon = this.add.sprite(560, 330, 'cannon');
		this.cannon.setScale(.4);

	this.cannon.setOrigin(113/300, 79/149);
		console.log(this.cannon, 'cannon')

	// Bad Guys
	this.creditCard = this.add.sprite(440, 100, 'creditcard');
	this.creditCard.setScale(.5);
	this.creditCard.percentTaken = .3;
	
	this.car = this.add.sprite(320, 100, 'car');
	this.car.setScale(.2);
	this.car.percentTaken = .3;

	this.car = this.add.sprite(320, 100, 'car');
	this.car.setScale(.2);
	this.car.percentTaken = .3;

	this.eatingout = this.add.sprite(200, 100, 'eatingout');
	this.eatingout.setScale(.3);
	this.eatingout.percentTaken = .3;
	
	this.moneyBag = this.add.sprite(495, 300, 'moneybag');
	this.moneyBag.setScale(.15);
	this.moneyBag.firingAngle = 8;
	this.moneyBag.rotateDirection = function (randianAngle) {
		Phaser.Actions.RotateAroundDistance(
			[this], // This takes an array.  Using "this" because of the context.
			{ x: 560  , y: 320 }, // This is where the wheel is.
			randianAngle, // You have use radian there like angle but wierder
			80 // radius aka distance from the pivot point to what is being rotated around
		);
	};
	this.moneyBag.rotateDirection(0);
		
	// Keyboard Inputputs
	this.upKey = 
		this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

	this.leftKey = 
		this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		
};

// Runs after every frame and is used to check 
// conditions and control things in thing in the game
// This may run 60 times per second and is the last thing that is ran
gameScene.update = function() {
	if (this.upKey.isDown && this.cannon.angle < 85) {
		this.cannon.angle += 1;
		this.moneyBag.firingAngle += 1;	
		this.moneyBag.rotateDirection(oneRadian);
	}
	
	if (this.leftKey.isDown && this.cannon.angle > -10) {
		this.cannon.angle -= 1;
		this.moneyBag.firingAngle -= 1;
		this.moneyBag.rotateDirection(oneRadian * -1);
	}	
	

			

};

// set config of game
let config = {
	type: Phaser.AUTO, // Will use webgl if avialable overwise it will use the canvas
	width: 640,
	height: 360,
	scene: gameScene
};

// create an new game and pass configuration to it
let game = new Phaser.Game(config);