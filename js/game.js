let gameScene = new Phaser.Scene('Game');

const oneRadian = Math.PI / 180;

// Runs first and is used to set all the variables
gameScene.init = function() {
	this.moneyInvestYears = []; // The number of money invested in that year
	this.moneyNotInvestedYears = [];
	this.interestRate = .09; // Assuming 9% interest rate
	this.moneyDistanceFromCannon = -92; // This is the distance away from the cannon
	this.firingMoney = false; // A flag when a money bag is fired
	this.movingSprites = []; // Theses are sprites that are moving
	this.enemySprites = []; // Theses are the enemy sprites
	this.moneyBagScale = .15; // This is the scale we are setting money bag image
	this.percentToTakeOff = 0;
	this.moneyToInvest = 2000;
	this.turns = 10;
	this.numberOfYearsPerTurn = 3;	
	this.scoreText = null;
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

	// Bad Guys
	this.creditCard = this.add.sprite(410, 300, 'creditcard');
	this.creditCard.setScale(.5);
	this.creditCard.percentTaken = .3;
	this.creditCard.moneyInvested = [];

	this.car = this.add.sprite(300, 100, 'car');
	this.car.setScale(.2);
	this.car.percentTaken = .3;
	this.car.moneyInvested = [];
	console.log(this.car, 'car');

	this.eatingout = this.add.sprite(170, 100, 'eatingout');
	this.eatingout.setScale(.3);
	this.eatingout.percentTaken = .3;
	this.eatingout.moneyInvested = [];

	this.enemySprites.push(this.creditCard);
	this.enemySprites.push(this.car);
	this.enemySprites.push(this.eatingout);

	// Money Bag
	this.moneyBag = this.physics.add.image(495, 300, 'moneybag');
	this.moneyBag.setScale(this.moneyBagScale);
	this.moneyBag.firingAngle = 8;
	this.moneyBag.rotateDirection = function (randianAngle) {
		Phaser.Actions.RotateAroundDistance(
			[this], // This takes an array.  Using "this" because of the context.
			{ x: 560  , y: 320 }, // This is where the wheel is.
			randianAngle, // You have use radian there like angle but wierder
			80 // radius aka distance from the pivot point to what is being rotated around
		);
	};

	// Moving Sprites
	this.movingSprites.push(this.eatingout);
	this.movingSprites.push(this.car);
	this.movingSprites.push(this.creditCard);
	this.movingSprites.push(this.pig);

	this.movingSprites.forEach(function(sprite) {
		let speedDirection = Math.random() > .5 ? 1 : -1;
		let speed = Math.random() * 1 + 3 * speedDirection;
		sprite.speedY = speed;
	}, this);

	this.moneyBag.rotateDirection(0);
	
	// Set the score text
	this.scoreText = this.add.text(16, 16, 'Invested: 0', { fontSize: '32px', fill: '#000' });

	// Keyboard Inputputs
	this.upKey = 
		this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

	this.leftKey = 
		this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

	this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	this.resetPlayingField();
};

gameScene.resetPlayingField = function() {
	this.moneyBag.body.gravity.y = 0;
	this.moneyBag.body.setVelocity(0,0);
	this.moneyBag.x = 495;
	this.moneyBag.y = 300;
	this.moneyBag.setScale(this.moneyBagScale);
	this.moneyBag.rotateDirection(oneRadian * this.cannon.angle);
	this.firingMoney = false;
	this.percentToTakeOff = 0;
	this.enemySprites.forEach(function(sprite) {
		sprite.hasBeenHit = false;
	});
};

gameScene.newTurn = function () {

	this.enemySprites.forEach(function(sprite) {
		for (var i = 0; i < this.numberOfYearsPerTurn; i += 1) {
			sprite.moneyInvested.push(
				sprite.hasBeenHit ? Math.ceil(sprite.percentTaken * this.moneyToInvest) : 0
			)
		}
	}, this);

	this.resetPlayingField();
	this.turns -= 1;

	if (this.turns == 0) {
		this.enemySprites.forEach(function(sprite) {
			console.log(sprite, 'sprite');
			console.log(sprite.moneyInvested, 'money to invest');	
		}, this);
		console.log(this.moneyInvestYears);
		console.log(this.totalInvestment(this.moneyInvestYears));
		console.log(this.moneyNotInvestedYears);
	}

}

// Runs after every frame and is used to check 
// conditions and control things in thing in the game
// This may run 60 times per second and is the last thing that is ran
gameScene.update = function() {

	if (this.upKey.isDown && this.cannon.angle < 85 ) {
		this.cannon.angle += 1;
		this.moneyBag.firingAngle += 1;
		if (!this.firingMoney) {
			this.moneyBag.rotateDirection(oneRadian);
		}
	}

	if (this.leftKey.isDown && this.cannon.angle > -10) {
		this.cannon.angle -= 1;
		this.moneyBag.firingAngle -= 1;
		if (!this.firingMoney) {
			this.moneyBag.rotateDirection(oneRadian * -1);
		}
	}	


	if (this.spaceBar.isDown && !this.firingMoney) {
		this.physics.velocityFromRotation(
			this.moneyBag.firingAngle * oneRadian,
			-250,
			this.moneyBag.body.velocity
		);
		this.moneyBag.body.gravity.y = 50;
		this.firingMoney = true;
	}

	if (this.moneyBag.x <= 10 || this.moneyBag.y > 650 || this.moneyBag.y < 10) {
		gameScene.calcInvestment(false);
		gameScene.newTurn();
	}



	this.movingSprites.forEach(function(sprite) {
		if (sprite.y <= 70) {
			sprite.y = 70;
			sprite.speedY *= -1;
		}

		if (sprite.y >= 300) {
			sprite.y = 299;
			sprite.speedY *= -1;	
		}

		sprite.y += sprite.speedY;
	});	

	this.enemySprites.forEach(function(sprite) {
		let hasCollisionOccurred = Phaser.Geom.Intersects.RectangleToRectangle(
			sprite.getBounds(), 
			this.moneyBag.getBounds()
		);
		if (hasCollisionOccurred && !sprite.hasBeenHit) {
			this.moneyBag.setScale(this.moneyBag.scaleY *.8);
			sprite.hasBeenHit = true;
			this.percentToTakeOff += sprite.percentTaken;
			console.log('lost some money');
		}
	}, this);

	let hasMoneyHitPig = Phaser.Geom.Intersects.RectangleToRectangle(
		this.pig.getBounds(), 
		this.moneyBag.getBounds()
	);

	if (hasMoneyHitPig) {
		this.calcInvestment(true);
		let totalMoneyInvested = this.moneyInvestYears.reduce(function(total,moneyInvestedThatYear) {
			return total + moneyInvestedThatYear;
		})
		this.scoreText.setText('Invested: $' + totalMoneyInvested );
		this.newTurn();
	}


};

gameScene.calcInvestment = function(hitPig) {
	let moneyToInvestEveryYear = Math.ceil((1 - this.percentToTakeOff) * this.moneyToInvest);
	for (var i = 0; i < this.numberOfYearsPerTurn; i += 1) {
		this.moneyInvestYears.push(hitPig ? moneyToInvestEveryYear : 0);
		this.moneyNotInvestedYears.push(!hitPig ? moneyToInvestEveryYear : 0);
	}
}

gameScene.totalInvestment = function(years) {
	return years.reduce(function(totalMoney, yearOfMoney) {
		totalMoney *= (1 + gameScene.interestRate);
		totalMoney += yearOfMoney;
		return totalMoney;
	});
};

// set config of game
let config = {
	type: Phaser.AUTO, // Will use webgl if avialable overwise it will use the canvas
	width: 640,
	height: 360,
	scene: gameScene,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { z: 300 },
			debug: true
		}
	}
};

// create an new game and pass configuration to it
let game = new Phaser.Game(config);