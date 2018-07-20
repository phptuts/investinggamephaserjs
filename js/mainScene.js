let mainScene = new Phaser.Scene('MainScene');

const oneRadian = Math.PI / 180;

// Runs first and is used to set all the variables
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
	mainScene.turns = 1; // The number of turns per game
	mainScene.numberOfYearsPerTurn = 3; // number of years per turn
	mainScene.scoreText = null; // the score text
	mainScene.yearsLeftText = null; // the years text
};

// Runs second and is used to set all the images used in the game
mainScene.preload = () => {
	mainScene.load.image('background', 'images/background.jpg');
	mainScene.load.image('pig', 'images/pig.png');
	mainScene.load.image('cannon', 'images/cannon.png');
	mainScene.load.image('creditcard', 'images/creditcard.png');
	mainScene.load.image('car', 'images/car.png');
	mainScene.load.image('eatingout', 'images/eatingout.png');
	mainScene.load.image('moneybag', 'images/money.png');
};

// Runs third and is used to position all the images initially in the game
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
	
	// Set the score text
	mainScene.scoreText = mainScene.add.text(40, 5, 'Invested: $0', { fontSize: '24px', fill: '#000' });
	mainScene.yearsLeftText = mainScene.add.text(330
									   , 5, 'Years Left: ' + mainScene.turns * mainScene.numberOfYearsPerTurn, { fontSize: '24px', fill: '#000' });

	// Keyboard Inputputs
	mainScene.upKey = 
		mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

	mainScene.leftKey = 
		mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

	mainScene.spaceBar = mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	mainScene.resetPlayingField();
};

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
		// TODO Pass data to get final result
		mainScene.enemySprites.forEach((sprite) => {
			console.log(sprite, 'sprite');
			console.log(sprite.moneyInvested, 'money to invest');	
		});
		console.log(mainScene.moneyInvestYears);
		console.log(mainScene.totalInvestment(mainScene.moneyInvestYears));
		console.log(mainScene.moneyNotInvestedYears);
		mainScene.scene.start('ResultScene', {'test': 'it'})
	}

}

// Runs after every frame and is used to check 
// conditions and control things in thing in the game
// mainScene.may run 60 times per second and is the last thing that is ran
mainScene.update = () => {

	if (mainScene.upKey.isDown && mainScene.cannon.angle < 85 ) {
		mainScene.cannon.angle += 1;
		mainScene.moneyBag.firingAngle += 1;
		if (!mainScene.firingMoney) {
			mainScene.moneyBag.rotateDirection(oneRadian);
		}
	}

	if (mainScene.leftKey.isDown && mainScene.cannon.angle > -10) {
		mainScene.cannon.angle -= 1;
		mainScene.moneyBag.firingAngle -= 1;
		if (!mainScene.firingMoney) {
			mainScene.moneyBag.rotateDirection(oneRadian * -1);
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
	
	mainScene.movingSprites.forEach(function(sprite) {
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

	if (mainScene.moneyBag.x <= 10 || mainScene.moneyBag.y > 650 || mainScene.moneyBag.y < 10) {
		mainScene.calcInvestment(false);
		mainScene.newTurn();
	}

	mainScene.enemySprites.forEach((sprite) => {
		let hasCollisionOccurred = Phaser.Geom.Intersects.RectangleToRectangle(
			sprite.getBounds(), 
			mainScene.moneyBag.getBounds()
		);
		if (hasCollisionOccurred && !sprite.hasBeenHit) {
			mainScene.moneyBag.setScale(mainScene.moneyBag.scaleY *.8);
			sprite.hasBeenHit = true;
			mainScene.percentToTakeOff += sprite.percentTaken;
			console.log('lost some money');
		}
	});

	let hasMoneyHitPig = Phaser.Geom.Intersects.RectangleToRectangle(
		mainScene.pig.getBounds(), 
		mainScene.moneyBag.getBounds()
	);

	if (hasMoneyHitPig) {
		mainScene.calcInvestment(true);
		let totalMoneyInvested = mainScene.moneyInvestYears.reduce(function(total,moneyInvestedThatYear) {
			return total + moneyInvestedThatYear;
		})
		mainScene.scoreText.setText('Invested: $' + totalMoneyInvested.toLocaleString('en') );
		mainScene.newTurn();
	}


};

mainScene.calcInvestment = (hitPig) => {
	let moneyToInvestEveryYear = Math.ceil(((100 - mainScene.percentToTakeOff) / 100) * mainScene.moneyToInvest);
	for (var i = 0; i < mainScene.numberOfYearsPerTurn; i += 1) {
		mainScene.moneyInvestYears.push(hitPig ? moneyToInvestEveryYear : 0);
		mainScene.moneyNotInvestedYears.push(!hitPig ? moneyToInvestEveryYear : 0);
	}
}

mainScene.totalInvestment = (years) => {
	return years.reduce((totalMoney, yearOfMoney) => {
		totalMoney *= (1 + mainScene.interestRate);
		totalMoney += yearOfMoney;
		return totalMoney;
	});
};