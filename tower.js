var c = require('config');
var f = require('functions');

module.exports = function () {
	for (let roomName in Game.rooms) {
		let room = Game.rooms[roomName];
		
		// Memory setup
		if (room.memory.wallRepairSpeed == undefined) room.memory.wallRepairSpeed = 'slow';	// slow, medium, fast
		if (!Memory.towers) Memory.towers = {};
		
		let towers = Game.rooms[roomName].find(FIND_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_TOWER
		});
		for (let tower of towers) {
		    
		    // Tower memory
			if (!Memory.towers[tower.id]) Memory.towers[tower.id] = {}

            // Check pause
            if (Memory.towers[tower.id].pause) {
                Memory.towers[tower.id].pause = false;
                continue;
            }

			// Attack healers
			let healer = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
				filter: function (hostile) {
					return _.includes(JSON.stringify(hostile.body),'heal');
				}
			});
			if (healer != undefined) {
				tower.attack(healer);
				Memory.towers[tower.id].pause = true;
				return;
			}
			
			// Attack hostiles
			let hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (hostile) {
			    tower.attack(hostile);
				Memory.towers[tower.id].pause = true;
			    return;
			}
			
			// Heal my creeps
			let healCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
				filter: c => c.hits < c.hitsMax
			});
			if (healCreep) {
			    tower.heal(healCreep);
				Memory.towers[tower.id].pause = true;
			    return;
			}

			// Repair
			let repairTarget = tower.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: s =>
					s.structureType != STRUCTURE_WALL
					&& s.structureType != STRUCTURE_RAMPART
					&& s.hits < s.hitsMax
			});
			if (repairTarget) {
				tower.repair(repairTarget);
				Memory.towers[tower.id].pause = true;
				return;
			}
			
			// Repair Rampart/Wall
			let speed = 8;
			if (room.memory.wallRepairSpeed == 'medium') speed = 4;
			else if (room.memory.wallRepairSpeed == 'fast') speed = 1;
			if (!(Game.time % speed)) {
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
    				Memory.towers[tower.id].pause = true;
					return;
				}
			}
			
		}
	}
};
