var c = require('config');
var f = require('functions');

module.exports = {
	
	build(spawn) {
		f.cpu('creepBuilder.build');
		for (let type in c.creepTypeCount) {
			// Check available energy
			let availableEnergy = spawn.room.energyAvailable;
			if(availableEnergy<200) return;
			// Check if this type is needed
			let amountToBuild = c.creepTypeCount[type];
			let currentAmount = _.filter(Memory.creeps,{type:type}).length;
			if(currentAmount >= amountToBuild) continue;
			// Pick body and name
			let body = pickBody(type, availableEnergy);

			if(!body) continue;
			let parts = body.parts;
			let name = generateName(type);
			let memory = {memory:{type:type}};
			// Spawn creep
			let r = spawn.spawnCreep(body.parts, name, memory);
			f.debug('Creep spawning '+name+' '+JSON.stringify(body));
			if(r) f.error('spawnCreep: '+r);
			else return;
		}

	},
	
}

function pickBody(type, maxCost) {
	let baseParts = [];
	if (type == 'A') baseParts = [MOVE,WORK,CARRY];
	if (type == 'B') baseParts = [ATTACK,MOVE];
	if (!baseParts.length) {
		f.error('creepBuilder.pickBody: Unknown body type');
		return false;
	}
	
	let body = {};
	
	for (let t = 1; t <= 100; t++) {			// Increment parts multiplier
		let parts = [];
		let cost = 0;
		
		for (let p = 0; p <= baseParts.length-1; p++) {	// Part
			for (let r = 1; r <= t; r++) {				// Multiply
				parts.push(baseParts[p]);
				if (baseParts[p] == TOUGH) cost += 10;
				if (baseParts[p] == MOVE) cost += 50;
				if (baseParts[p] == WORK) cost += 100;
				if (baseParts[p] == CARRY) cost += 50;
				if (baseParts[p] == ATTACK) cost += 80;
				if (baseParts[p] == RANGED_ATTACK) cost += 150;
				if (baseParts[p] == HEAL) cost += 250;
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