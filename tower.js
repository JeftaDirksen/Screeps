module.exports = function () {
	for (const roomName in Game.rooms) {
		const room = Game.rooms[roomName];
		
		const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_TOWER
		});
		let towerCount = towers.length;
		
		for (let t = 0; t < towerCount; t++) {
		    // Check if it is this towers turn to fire
		    if ((Game.time + t) % towerCount) continue;
		    
		    let tower = towers[t];

			// Attack healers
			let healer = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
				filter: function (hostile) {
					return _.includes(JSON.stringify(hostile.body),'heal');
				}
			});
			if (healer != undefined) {
				tower.attack(healer);
				continue;
			}
			
			// Attack hostiles
			let hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (hostile) {
			    tower.attack(hostile);
			    continue;
			}
			
			// Heal my creeps
			let healCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
				filter: c => c.hits < c.hitsMax
			});
			if (healCreep) {
			    tower.heal(healCreep);
			    continue;
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
				continue;
			}
			
			// Repair Rampart/Wall
			if (tower.energy < .9*tower.energyCapacity) continue;
			let targets = tower.room.find(FIND_STRUCTURES, {
				filter: s =>
					(
						s.structureType == STRUCTURE_WALL
						|| s.structureType == STRUCTURE_RAMPART
					)
					&& s.hits < s.hitsMax
					&& s.hits < 1000000
			});
			let target = _.sortBy(targets, 'hits')[0];
			if (target) {
				tower.repair(target);
				continue;
			}
				
		}
	}
}
