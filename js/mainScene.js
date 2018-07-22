let mainScene = new Phaser.Scene('MainScene');

const oneRadian = Math.PI / 180;

/**	
 * Sets up all the initial values for the game.
 */
mainScene.init = () => {
	mainScene.moneyInvestYears = []; // The number of money invested in that year
	mainScene.moneyNotInvestedYears = [];
	mainScene.interestRate = .09; // Assuming 9% interest rate
	mainScene.moneyDistanceFromCannon = -92; // This is the distance away from the cannon
	mainScene.firingMoney = false; // A flag when a money bag is fired
	mainScene.movingSprites = []; // Theses are sprites that are moving
	mainScene.enemySprites = []; // Theses are the enemy sprites
	mainScene.moneyBagScale = .15; // This is the scale we are setting money bag image
	mainScene.percentToTakeOff = 0; // This is the percentage taken by the bad sprites of the money
	mainScene.moneyToInvest = 2000; // This is amount that is invested per year
	mainScene.turns = 10; // The number of turns per game
	mainScene.numberOfYearsPerTurn = 3; // number of years per turn
	mainScene.scoreText = null; // the score text
	mainScene.yearsLeftText = null; // the years text
};

/**	
 * Loads all the images
 */
mainScene.preload = () => {
	mainScene.load.image('background', 'images/background.jpg');
	mainScene.load.image('pig', 'images/pig.png');
	mainScene.load.image('cannon', 'images/cannon.png');
	mainScene.load.image('creditcard', 'images/creditcard.png');
	mainScene.load.image('car', 'images/car.png');
	mainScene.load.image('eatingout', 'images/eatingout.png');
	mainScene.load.image('moneybag', 'images/money.png');
};

/**
 * Positions all the characters on the screen
 */ 
mainScene.create = () => {

	// positions the background
	let bg = mainScene.add.sprite(0,0, 'background');
	bg.setOrigin(0,0);

	// position the pig
	mainScene.pig = mainScene.add.sprite(50, 200, 'pig');
	mainScene.pig.setScale(.2);

	// position the cannon and change origin so it rotates around the wheels
	mainScene.cannon = mainScene.add.sprite(560, 330, 'cannon');
	mainScene.cannon.setScale(.4);
	mainScene.cannon.setOrigin(113/300, 79/149);

	// Bad Guys
	mainScene.creditCard = mainScene.add.sprite(410, 300, 'creditcard');
	mainScene.creditCard.setScale(.5);
	mainScene.creditCard.percentTaken = 30;
	mainScene.creditCard.moneyInvested = [];

	mainScene.car = mainScene.add.sprite(300, 100, 'car');
	mainScene.car.setScale(.2);
	mainScene.car.percentTaken = 30;
	mainScene.car.moneyInvested = [];

	mainScene.eatingout = mainScene.add.sprite(170, 100, 'eatingout');
	mainScene.eatingout.setScale(.3);
	mainScene.eatingout.percentTaken = 30;
	mainScene.eatingout.moneyInvested = [];

	mainScene.enemySprites.push(mainScene.creditCard);
	mainScene.enemySprites.push(mainScene.car);
	mainScene.enemySprites.push(mainScene.eatingout);

	// Money Bag
	mainScene.moneyBag = mainScene.physics.add.image(495, 300, 'moneybag');
	mainScene.moneyBag.setScale(mainScene.moneyBagScale);
	mainScene.moneyBag.firingAngle = 8;
	mainScene.moneyBag.rotateDirection =  (randianAngle) => {
		Phaser.Actions.RotateAroundDistance(
			[mainScene.moneyBag], // this takes an array.  Using "mainScene. because of the context.
			{ x: 560  , y: 320 }, // mainScene.is where the wheel is.
			randianAngle, // You have use radian there like angle but wierder
			80 // radius aka distance from the pivot point to what is being rotated around
		);
	};

	// Moving Sprites
	mainScene.movingSprites.push(mainScene.eatingout);
	mainScene.movingSprites.push(mainScene.car);
	mainScene.movingSprites.push(mainScene.creditCard);
	mainScene.movingSprites.push(mainScene.pig);

	mainScene.movingSprites.forEach((sprite) => {
		let speedDirection = Math.random() > .5 ? 1 : -1;
		let speed = Math.random() * 1 + 2 * speedDirection;
		sprite.speedY = speed;
	});

	mainScene.moneyBag.rotateDirection(0);
	mainScene.moneyBag.isOffBoard = () => {
		return mainScene.moneyBag.x <= 10 || 
			mainScene.moneyBag.y > 650 || 
			mainScene.moneyBag.y < 10
	};

	// Set the score text
	mainScene.scoreText = mainScene.add.text(40, 5, 'Invested: $0', { fontSize: '24px', fill: '#000' });
	mainScene.yearsLeftText = mainScene.add.text(330, 5, 'Years Left: ' + mainScene.turns * mainScene.numberOfYearsPerTurn, { fontSize: '24px', fill: '#000' });

	// Keyboard Inputputs
	mainScene.upKey = 
		mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

	mainScene.leftKey = 
		mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

	mainScene.spaceBar = mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	mainScene.resetPlayingField();
};

/**
 * Resets the playing field values
 */
mainScene.resetPlayingField = () => {
	mainScene.moneyBag.body.gravity.y = 0;
	mainScene.moneyBag.body.setVelocity(0,0);
	mainScene.moneyBag.x = 495;
	mainScene.moneyBag.y = 300;
	mainScene.moneyBag.setScale(mainScene.moneyBagScale);
	mainScene.moneyBag.rotateDirection(oneRadian * mainScene.cannon.angle);
	mainScene.firingMoney = false;
	mainScene.percentToTakeOff = 0;
	mainScene.enemySprites.forEach(function(sprite) {
		sprite.hasBeenHit = false;
	});
};

/** 
 * Executes every turn and is used to end the game
 * Calculates investment dollars lost to sprites
 */
mainScene.newTurn = () => {

	mainScene.enemySprites.forEach((sprite) => {
		for (var i = 0; i < mainScene.numberOfYearsPerTurn; i += 1) {
			sprite.moneyInvested.push(
				sprite.hasBeenHit ? Math.ceil((sprite.percentTaken / 100) * mainScene.moneyToInvest) : 0
			)
		}
	});

	mainScene.resetPlayingField();
	mainScene.turns -= 1;
	mainScene.yearsLeftText.setText('Years Left: ' + mainScene.turns * mainScene.numberOfYearsPerTurn)

	if (mainScene.turns == 0) {
		// This means the game is over.
		mainScene.scene.start('ResultScene', mainScene.finalResult())
	}

};

/**	
 * Runs repeated
 * 1) Checks if the cannon should move and moves it
 * 2) Checks if money bag should be fired.
 * 3) Checks if money bag hit the sprite
 * 4) Checks if the money bag is out of bounds or hit the pig and updates the investments
 */
mainScene.update = () => {

	if (mainScene.moveCannon()) {
		let direction = mainScene.upKey.isDown ? 1 : -1;
		mainScene.cannon.angle += direction;
		mainScene.moneyBag.firingAngle += direction;
		if (!mainScene.firingMoney) {
			mainScene.moneyBag.rotateDirection(oneRadian * direction);
		}
	}


	if (mainScene.spaceBar.isDown && !mainScene.firingMoney) {
		mainScene.physics.velocityFromRotation(
			mainScene.moneyBag.firingAngle * oneRadian,
			-250,
			mainScene.moneyBag.body.velocity
		);
		mainScene.moneyBag.body.gravity.y = 50;
		mainScene.firingMoney = true;
	}

	mainScene.movingSprites.forEach((sprite) => {
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

	mainScene
		.enemySprites
		.filter(sprite => mainScene.hasSpriteCollidedWithEnemy(sprite))
		.forEach((sprite) => {
		mainScene.moneyBag.setScale(mainScene.moneyBag.scaleY *.8);
		sprite.hasBeenHit = true;
		mainScene.percentToTakeOff += sprite.percentTaken;
	});


	if (mainScene.hasMoneyHitPig() || mainScene.moneyBag.isOffBoard()) {
		mainScene.addUpInvestmentMoneyPerTurn(mainScene.hasMoneyHitPig());
		mainScene.scoreText.setText('Invested: $' + mainScene.sumMoneyInvested().toLocaleString('en') );
		mainScene.newTurn();
	}
};

/**	
 * Returns true if the cannon should move.
 */
mainScene.moveCannon = () => {
	return (mainScene.leftKey.isDown && mainScene.cannon.angle > -10) ||
		(mainScene.upKey.isDown && mainScene.cannon.angle < 85);
};


/**	
 * Sums the total money invested without interest
 */
mainScene.sumMoneyInvested = () => {
	return mainScene.moneyInvestYears.reduce(function(total,moneyInvestedThatYear) {
		return total + moneyInvestedThatYear;
	})
};

/** 
 * Returns true if the sprite has collided with money and has not been marked as a hit.
 */
mainScene.hasSpriteCollidedWithEnemy = (sprite) => {
	return Phaser.Geom.Intersects.RectangleToRectangle(
		sprite.getBounds(), 
		mainScene.moneyBag.getBounds()
	) && !sprite.hasBeenHit;
};

/**
 * Returns true if the pig was been hit with the money.
 */
mainScene.hasMoneyHitPig = () => {
	return Phaser.Geom.Intersects.RectangleToRectangle(
		mainScene.pig.getBounds(), 
		mainScene.moneyBag.getBounds()
	);
};

/**	
 * This function calculates the money that was either invest or lost for the years representing 
 * the turn. 
 */
mainScene.addUpInvestmentMoneyPerTurn = (hitPig) => {
	let moneyToInvestEveryYear = Math.ceil(((100 - mainScene.percentToTakeOff) / 100) * mainScene.moneyToInvest);
	for (var i = 0; i < mainScene.numberOfYearsPerTurn; i += 1) {
		mainScene.moneyInvestYears.push(hitPig ? moneyToInvestEveryYear : 0);
		mainScene.moneyNotInvestedYears.push(!hitPig ? moneyToInvestEveryYear : 0);
	}
}

/**	
 * This caculates the total amount of investment with interest applied
 */
mainScene.investmentsWithInterestTotaled = (years) => {
	return years.reduce((totalMoney, yearOfMoney) => {
		totalMoney *= (1 + mainScene.interestRate);
		totalMoney += yearOfMoney;
		return totalMoney;
	});
};

mainScene.finalResult = () => {

	
	let digitalOptions =  {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	};
	
	let totalSaved = mainScene.sumMoneyInvested().toLocaleString('en', digitalOptions);

	let totalInvested = mainScene
							.investmentsWithInterestTotaled(mainScene.moneyInvestYears)
							.toLocaleString('en', digitalOptions);
	let totalNotInvested = mainScene
						.investmentsWithInterestTotaled(mainScene.moneyNotInvestedYears)
						.toLocaleString('en', digitalOptions);
	let carCost = mainScene
					.investmentsWithInterestTotaled(mainScene.car.moneyInvested)
					.toLocaleString('en', digitalOptions);

	let fastFoodCost = mainScene
						.investmentsWithInterestTotaled(mainScene.car.moneyInvested)
						.toLocaleString('en', digitalOptions);
	
	let creditCardCost = mainScene
							.investmentsWithInterestTotaled(mainScene.creditCard.moneyInvested)
							.toLocaleString('en', digitalOptions);

	return {
		totalSaved,
		totalInvested,
		totalNotInvested,
		carCost,
		fastFoodCost,
		creditCardCost
	};
};