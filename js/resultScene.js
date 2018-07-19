let resultScene = new Phaser.Scene('ResultScene');

resultScene.init = () => {
	
};

resultScene.preload = () => {
	resultScene.load.image('retireement-bg', 'images/retirement-bg.png');
	resultScene.movedSaved = null;
	resultScene.totalRetirementMoney = null;
	resultScene.car = null;
	resultScene.creditCard = null;
	resultScene.fastfood = null;
};

resultScene.create = () => {
	let bg = resultScene.add.sprite(0,0, 'retireement-bg');
	bg.setOrigin(0,0);
	
	resultScene.movedSaved = resultScene.add.text(20, 25, 'Saved: $20,000', { fontSize: '24px', fill: '#000' });
	
	resultScene.totalRetirementMoney = resultScene.add.text(20, 5, 'Retired With: $102,000', { fontSize: '24px', fill: '#000' });

};

resultScene.update = () => {

};