var c = require('config');
var f = require('functions');

module.exports = {
	
	build(spawn) {
		if (spawn.spawning) return;
		
		let energyCapacity = spawn.room.energyCapacityAvailable;
		if(!_.filter(Memory.creeps,{role:'harvester'}).length) energyCapacity = 300;
		let energyAvailable = spawn.room.energyAvailable;
		if(energyAvailable < energyCapacity) return;
		
		for(let roleName in c.creep.role) {
			let role = c.creep.role[roleName];
			let currentCount = _.filter(Memory.creeps,{role:roleName}).length;
			let toBuildCount = role.count;
			f.debug(roleName+' '+currentCount+'/'+toBuildCount);
			let body = getBody(role.creepType, energyCapacity);
			if(!body) continue;
			f.debug('body: '+JSON.stringify(body));
			let name = generateName(roleName);
			let memory = {memory:{role:roleName}};
			let r = spawn.spawnCreep(body, name, memory);
			f.debug('Creep spawning '+name+' '+JSON.stringify(body));
			if(r) f.error('spawnCreep: '+r);
			else return;
		}
	},
	
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
		//f.debug('body['+i+']: '+JSON.stringify(body));
		if(body.cost <= energy) return body.body;
	}
}