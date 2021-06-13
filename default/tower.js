module.exports = function () {
	for (const roomName in Game.rooms) {
		const room = Game.rooms[roomName];
		
		const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_TOWER
		});
		let towerCount = towers.length;
		
		for (let t = 0; t < towerCount; t++) {
		    // Check if it is this towers turn to fire
		    //if ((Game.time + t) % towerCount) continue;
		    
		    let tower = towers[t];

			// Attack healers
			let healer = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 5, {
				filter: function (hostile) {
					return _.includes(JSON.stringify(hostile.body),'heal');
				}
			})[0];
			if (healer != undefined) {
				tower.attack(healer);
				continue;
			}
			
			// Attack hostiles
			let hostile = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 5)[0];
			if (hostile) {
			    tower.attack(hostile);
			    continue;
			}

			// Heal my creeps
			let healCreep = tower.pos.findInRange(FIND_MY_CREEPS, 5, {
				filter: c => c.hits < c.hitsMax
			})[0];
			if (healCreep) {
			    tower.heal(healCreep);
			    continue;
			}

			// Repair
			let repairTarget = tower.pos.findInRange(FIND_STRUCTURES, 5, {
				filter: s =>
					s.structureType != STRUCTURE_WALL
					&& s.structureType != STRUCTURE_RAMPART
					&& s.hits < s.hitsMax
			})[0];
			if (repairTarget) {
				tower.repair(repairTarget);
				continue;
			}
			
			// Repair Rampart/Wall
			//if ( (Game.time % 5) ) continue;
			//if (tower.energy < .9*tower.energyCapacity) continue;
			let targets = tower.pos.findInRange(FIND_STRUCTURES, 5, {
				filter: s =>
					(
						s.structureType == STRUCTURE_WALL
						|| s.structureType == STRUCTURE_RAMPART
					)
					&& s.hits < s.hitsMax
					&& s.hits < (room.controller.level - 2) * 10000000 / 6
			});
			let target = _.sortBy(targets, 'hits')[0];
			if (target) {
				tower.repair(target);
				continue;
			}
				
		}
	}
}
