let resultScene = new Phaser.Scene('ResultScene');

resultScene.init = (config) => {
	this.totalSaved = config.totalSaved;
	this.totalInvested = config.totalInvested;
	this.totalNotInvested = config.totalNotInvested;
	this.carInvest = config.carCost;
	this.fastFoodCost = config.fastFoodCost;
	this.creditCardCost = config.creditCardCost;

};

	
resultScene.preload = () => {
	resultScene.load.image('rocking-chair', 'images/rocking-chair.png');
	resultScene.movedSaved = null;
	resultScene.totalRetirementMoney = null;
	resultScene.yourRetirementLostText = null;
	resultScene.notsaving = null;
	resultScene.car = null;
	resultScene.creditCard = null;
	resultScene.fastfood = null;
	resultScene.restart =null;
	console.log(this.config);
	
};

resultScene.create = () => {
	let rockingChair = resultScene.add.sprite(0,0, 'rocking-chair');
	rockingChair.setOrigin(0,0);
	rockingChair.setScale(.3);
	rockingChair.y = 210;
	rockingChair.x = 20;
	resultScene.cameras.main.setBackgroundColor('#ccccff'); 
	resultScene.totalRetirementMoney = 
	resultScene.add.text(320, 20, 'Retired With: $' + this.totalInvested, { fontSize: '36px', fill: '#00AF00' });
	resultScene.totalRetirementMoney.setOrigin(.5, .5);
	
	resultScene.movedSaved = 
		resultScene.add.text(320, 60, 'Put in: $' + this.totalSaved, { fontSize: '36px', fill: '#00AF00' });
	resultScene.movedSaved.setOrigin(.5, .5);

		
	resultScene.yourRetirementLostText =
		resultScene.add.text(320, 110, 'Your retirement lost to', { fontSize: '36px', fill: '#AA0000' }); 
	resultScene.yourRetirementLostText.setOrigin(.5, .5);

	
	resultScene.notsaving = 
		resultScene.add.text(170, 140, 'Not Saving  $' + this.totalNotInvested, { fontSize: '20px', fill: '#AA0000' })

	
	
	resultScene.creditCard = 
		resultScene.add.text(170, 165, 'Credit Card $' + this.creditCardCost, { fontSize: '20px', fill: '#AA0000' }); 

	resultScene.car =
		resultScene.add.text(170, 190, 'Cars        $' + this.carInvest, { fontSize: '20px', fill: '#AA0000' }); 

	resultScene.fastfood =
		resultScene.add.text(170, 215, 'Fast food   $' + this.fastFoodCost, { fontSize: '20px', fill: '#AA0000' }); 

	
	resultScene.restart = 
				resultScene.add.text(170, 240, 'Restart Game', { fontSize: '40px', fill: '#e58129' }); 

	resultScene.restart.setInteractive();
	resultScene.restart.on('pointerdown', (event) =>  {
			resultScene.scene.start('MainScene');
	});
};

resultScene.update = () => {

};