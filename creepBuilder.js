var f = require('functions');

module.exports = {
	
	build(spawn) {
		f.cpu('creepBuilder.build');
		let type = 'A';
		let availableEnergy = spawn.room.energyAvailable;
		if(availableEnergy<200) return;
		let body = pickBody(type, availableEnergy);
		if(!body) return;
		let parts = body.parts;
		let name = generateName(type);
		let memory = {memory:{type:type}};
		let r = spawn.spawnCreep(body.parts, name, memory);
		f.debug('Spawning creep: '+JSON.stringify(body));
		if(r) f.error('spawnCreep: '+r);
	},
	
}

function pickBody(type, maxCost) {
	let baseParts = [];
	if (type == 'A') baseParts = [MOVE,WORK,CARRY];
	else return false;
	
	let body = {};
	
	for (let t = 1; t <= 10; t++) {			// Increment parts multiplier
		let parts = [];
		let cost = 0;
		
		for (let p = 0; p <= baseParts.length-1; p++) {	// Part
			for (let r = 1; r <= t; r++) {				// Multiply
				parts.push(baseParts[p]);
				if (baseParts[p] == MOVE) cost += 50;
				if (baseParts[p] == WORK) cost += 100;
				if (baseParts[p] == CARRY) cost += 50;
			}
		}
		if (cost > maxCost) {
			if(_.isEmpty(body)) return false;
			return body;
		}
		else {
			body = {type:type,cost:cost,parts:parts};
		}
	}
	
}

function generateName(type) {
	let t = type.charAt(0).toUpperCase();
	for(let i = 1; i<=25; i++) {
		let name = t+i;
		if(!Game.creeps[name]) {
			return name;
		}
	}
	f.error('Name generation failed ('+type+')');
}