var c = require('config');
var f = require('functions');

module.exports = function() {
	for (let spawnName in Game.spawns) {
		let spawn = Game.spawns[spawnName];
		
		// Check if spawn memory is set
		for(let roleName in c.creep.role) {
			if(!(spawn.memory[roleName+'s'] >= 0)) {
				f.debug(spawnName+' set memory '+roleName+'s');
				spawn.memory[roleName+'s'] = c.creep.role[roleName].defaultAmount;
			}
		}
		
		// Check if spawn already spawning
		if (spawn.spawning) continue;
		
		// Get energy stats
		let energyCapacity = spawn.room.energyCapacityAvailable;
		let energyAvailable = spawn.room.energyAvailable;
		
		// Spawn failure checks/fixes
		let roomHarvesters = spawn.room.find(FIND_MY_CREEPS,{
				filter: c => c.memory.role == 'harvester'
		}).length;
		if(!roomHarvesters) energyCapacity = 300;
		let roomTransporter = spawn.room.find(FIND_MY_CREEPS,{
				filter: c => c.memory.role == 'transporter'
		}).length;
		if(!roomTransporter) energyCapacity = 300;
		
		// Check if energy full
		if(energyAvailable < energyCapacity) continue;
		
		for(let roleName in c.creep.role) {
			let role = c.creep.role[roleName];
			// Check if build enough already
			let currentCount = spawn.room.find(FIND_MY_CREEPS,{
				filter: c => c.memory.role == roleName
			}).length;
			let toBuildCount = spawn.memory[roleName+'s'];
			if(currentCount >= toBuildCount) continue;
			// Role specific checks
			// Claimer only when claim is set
			if(roleName == 'claimer' && !spawn.memory.claim) continue;
			// Builder only when constructionSite exists
			if(roleName == 'builder') {
				let sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length;
				if(!sites) continue;
			}
			// Repairer only when no tower in room
			if(roleName == 'repairer') {
				let towers = spawn.room.find(FIND_MY_STRUCTURES, {
					filter: { structureType: STRUCTURE_TOWER }
				}).length;
				if(towers) continue;
			}
			// Get body
			let body = getBody(role.creepType, energyAvailable);
			if(!body) continue;
			let name = generateName(roleName);
			let memory = {memory:{role:roleName,room:spawn.room.name}};
			// Claimer memory
			if(roleName == 'claimer') {
				memory = {memory:{
					role:roleName,
					room: spawn.memory.claim,
					claimTarget: spawn.memory.claim,
				}};
			}
			// Build creep
			let r = spawn.spawnCreep(body, name, memory);
			if(r) f.error('spawn.spawnCreep '+r);
			else {
				// Claimer reset spawn memory
				if(roleName == 'claimer') spawn.memory.claim = null;
				f.debug(spawnName+' spawning creep '+name);
				return;
			}
		}
	}
}

function generateName(role) {
	let r = role.charAt(0).toUpperCase();
	for(let i = 1; i<=100; i++) {
		let name = r+i;
		if(!Game.creeps[name]) {
			return name;
		}
	}
	f.error('Name generation failed ('+type+')');
}

function getBody(type, energy) {
	let bodies = c.creep.type[type];
	for(let i = bodies.length-1; i >= 0; i-- ) {
		let body = c.creep.type[type][i];
		if(body.cost <= energy) return body.body;
	}
}