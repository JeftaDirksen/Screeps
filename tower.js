var f = require('functions');

module.exports = function () {
	for (let roomName in Game.rooms) {
		let towers = Game.rooms[roomName].find(FIND_STRUCTURES, {
			filter: (s) => s.structureType == STRUCTURE_TOWER
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
					let target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
						filter: s => {
							return s.structureType != STRUCTURE_WALL
							&& s.structureType != STRUCTURE_RAMPART
							&& s.hits < s.hitsMax;
						}
					});
					if (target) {
						tower.repair(target);
					}
					
					else if (!(Game.time % 15)) {
						// Slow repair Rampart/Wall
						let targets = tower.room.find(FIND_STRUCTURES, {
							filter: s => {
								return (
									s.structureType == STRUCTURE_WALL
									|| s.structureType == STRUCTURE_RAMPART
								) && s.hits < s.hitsMax;
							}
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
