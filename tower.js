var c = require('config');
var f = require('functions');

module.exports = function () {
	for (let roomName in Game.rooms) {
		let room = Game.rooms[roomName];
		
		// Memory setup
		if(room.memory.wallRepairSpeed == undefined) room.memory.wallRepairSpeed = 'slow';	// slow, medium, fast
		
		let towers = Game.rooms[roomName].find(FIND_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_TOWER
		});
		for (let tower of towers) {
			// Attack healers
			let healer = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
				filter: function (hostile) {
					return _.includes(JSON.stringify(hostile.body),'heal');
				}
			});
			if (healer != undefined) {
				tower.attack(healer);
				return;
			}
			
			// Attack hostiles
			let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (target) tower.attack(target);
			
			else {
				// Heal my creeps
				let target = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
					filter: c => c.hits < c.hitsMax
				});
				if (target) tower.heal(target);

				else {
					// Repair
					let speed = 15;
					if(room.memory.wallRepairSpeed == 'medium') speed = 8;
					else if(room.memory.wallRepairSpeed == 'fast') speed = 1;
					
					let target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
						filter: s =>
							s.structureType != STRUCTURE_WALL
							&& s.structureType != STRUCTURE_RAMPART
							&& s.hits < s.hitsMax
					});
					if (target) {
						tower.repair(target);
					}
					
					else if (!(Game.time % speed)) {
						// Repair Rampart/Wall
						let targets = tower.room.find(FIND_STRUCTURES, {
							filter: s =>
								(
									s.structureType == STRUCTURE_WALL
									|| s.structureType == STRUCTURE_RAMPART
								)
								&& s.hits < s.hitsMax
						});
						let target = _.sortBy(targets, 'hits')[0];
						if (target) {
							tower.repair(target);
						}
						
					}
				}
			}
		}
	}
};
