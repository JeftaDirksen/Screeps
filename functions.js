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
	
	roomSwitch(creep) {
		if(creep.memory.target && creep.memory.target != creep.room.name) {
			// Room visible
			let room = Game.rooms[creep.memory.target];
			if(room) {
				creep.goTo(Game.rooms[creep.memory.target].controller);
				return true;
			}
			// Room not visible yet
			else {
				let exit = creep.pos.findClosestByRange(
					creep.room.findExitTo(creep.memory.target)
				);
				creep.goTo(exit);
				return true;
			}
		}
		else return false;
	},
	
};

function font(string,color) {
	return '<font color="'+color+'">'+string+'</font>';
}
