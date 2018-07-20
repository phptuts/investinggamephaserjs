let resultScene = new Phaser.Scene('ResultScene');

resultScene.init = (config) => {

};

resultScene.preload = () => {
	resultScene.load.image('retireement-bg', 'images/retirement-bg.png');
	resultScene.movedSaved = null;
	resultScene.totalRetirementMoney = null;
	resultScene.notsaving = null;
	resultScene.car = null;
	resultScene.creditCard = null;
	resultScene.fastfood = null;
	console.log(this.config);
	
};

resultScene.create = () => {
	let bg = resultScene.add.sprite(0,0, 'retireement-bg');
	bg.setOrigin(0,0);
	
	resultScene.totalRetirementMoney = 
	resultScene.add.text(320, 20, 'Retirement: $120,000', { fontSize: '36px', fill: '#00AF00' });
	resultScene.totalRetirementMoney.setOrigin(.5, .5);
	
	resultScene.movedSaved = 
		resultScene.add.text(320, 60, 'Money Saved: $20,000', { fontSize: '36px', fill: '#00AF00' });
	resultScene.movedSaved.setOrigin(.5, .5);

	resultScene.notsaving =
		resultScene.add.text(320, 110, 'Not saving money: $40,000', { fontSize: '24px', fill: '#AA0000' }); 
	resultScene.notsaving.setOrigin(.5, .5);
	
	resultScene.creditCard = 
		resultScene.add.text(320, 140, 'Creditcards: $40,000', { fontSize: '24px', fill: '#AA0000' }); 
	resultScene.creditCard.setOrigin(.5, .5);

	resultScene.car =
		resultScene.add.text(320, 165, 'Cars: $40,000', { fontSize: '24px', fill: '#AA0000' }); 
	resultScene.car.setOrigin(.5, .5);

	resultScene.fastfood =
		resultScene.add.text(320, 190, 'Fast food: $40,000', { fontSize: '24px', fill: '#AA0000' }); 
	resultScene.fastfood.setOrigin(.5, .5);

};

resultScene.update = () => {

};