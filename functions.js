var c = require('config');

module.exports = {
	
	debug(message) {
		if(!c.debug) return;
		let tick = font('['+Game.time+'] ','Gray');
		let debug = font('debug: ','LightSkyBlue');
		let msg = tick+debug+message;
		console.log(msg);
	},
	
	error(message) {
		let tick = font('['+Game.time+'] ','Gray');
		let error = font('error: ','OrangeRed');
		let msg = tick+error+message;
		console.log(msg);
	},
	
	warning(message) {
		let tick = font('['+Game.time+'] ','Gray');
		let warning = font('warning: ','Orange');
		let msg = tick+warning+message;
		console.log(msg);
	},

	thisTick(everyThisTicks) {
		return !(Game.time % everyThisTicks);
	},
	
};

function font(string,color) {
	return '<font color="'+color+'">'+string+'</font>';
}
