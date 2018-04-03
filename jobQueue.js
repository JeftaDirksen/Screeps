var c = require('config');
var f = require('functions');

module.exports = {
	
	generateJobs() {

		// For every room
		for (let roomName in Game.rooms) {
			let room = Game.rooms[roomName];

			// Spawn/extension supply job
			var structures = room.find(FIND_MY_STRUCTURES,{
				filter: s => (
					s.structureType == STRUCTURE_SPAWN
					|| s.structureType == STRUCTURE_EXTENSION
					) && s.energy < s.energyCapacity
			});
			for (let i in structures) {
				let structure = structures[i];
				let type = 'transfer';
				let target = structure.id;
				let resourceType = RESOURCE_ENERGY;
				let creepType = 'A';
				let jobCount = c.job.spawnSupply.count;
				let jobPrio = c.job.spawnSupply.priority;
				if(countJobs(type, target) < jobCount) {
					createJob(type, target, resourceType, creepType, jobPrio);
				}
			}
			
			// Upgrade room controller job
			var type = 'upgrade';
			var target = room.controller.id;
			var resourceType = RESOURCE_ENERGY;
			var creepType = 'A';
			var jobCount = c.job[type].count;
			var jobPrio = c.job[type].priority;
			if(countJobs(type, target) < jobCount) {
				createJob(type, target, resourceType, creepType, jobPrio);
			}
		
			// Build Construction sites job
			var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
			for (let i in constructionSites) {
				let site = constructionSites[i];
				let type = 'build';
				let target = site.id;
				let resourceType = RESOURCE_ENERGY;
				let creepType = 'A';
				let jobCount = c.job[type].count;
				let jobPrio = c.job[type].priority;
				if(countJobs(type, target) < jobCount) {
					createJob(type, target, resourceType, creepType, jobPrio);
				}
			}

			// Container harvester job
			var structures = room.find(FIND_STRUCTURES,{
				filter: s => s.structureType == STRUCTURE_CONTAINER
					&& _.sum(s.store) < s.storeCapacity
			});
			for (let i in structures) {
				let structure = structures[i];
				let type = 'harvest';
				let target = structure.id;
				let resourceType = RESOURCE_ENERGY;
				let creepType = 'A';
				let jobCount = c.job.containerHarvest.count;
				let jobPrio = c.job.containerHarvest.priority;
				if(countJobs(type, target) < jobCount) {
					createJob(type, target, resourceType, creepType, jobPrio);
				}
			}

			// Storage harvester job
			var structures = room.find(FIND_MY_STRUCTURES,{
				filter: s => s.structureType == STRUCTURE_STORAGE
					&& _.sum(s.store) < s.storeCapacity
			});
			if (structures.length) {
				let storage = structures[0];
				let type = 'harvest';
				let target = storage.id;
				let resourceType = RESOURCE_ENERGY;
				let creepType = 'A';
				let jobCount = c.job.storageHarvest.count;
				let jobPrio = c.job.storageHarvest.priority;
				if(countJobs(type, target) < jobCount) {
					createJob(type, target, resourceType, creepType, jobPrio);
				}
			}

			// Repair job
			var tower = room.find(FIND_MY_STRUCTURES,{
				filter: {structureType: STRUCTURE_TOWER}
			});
			// Only when no tower in room
			if (!tower.length) {
				let structures = room.find(FIND_STRUCTURES,{
					filter: s => (s.structureType == STRUCTURE_ROAD
						|| s.structureType == STRUCTURE_CONTAINER)
						&& s.hits < s.hitsMax
				});
				for (let i in structures) {
					let structure = structures[i];
					let type = 'repair';
					let target = structure.id;
					let resourceType = RESOURCE_ENERGY;
					let creepType = 'A';
					let jobCount = c.job[type].count;
					let jobPrio = c.job[type].priority;
					if(countJobs(type, target) < jobCount) {
						createJob(type, target, resourceType, creepType, jobPrio);
					}
				}
			}

			// Link supply job (Supply link which is closest to a container)
			var structures = room.find(FIND_MY_STRUCTURES,{
				filter: {structureType: STRUCTURE_LINK}
			});
			//f.debug('links: '+JSON.stringify(_.pluck(structures,'id')));
			var closestDistance = 100;
			var linkWithClosest = null;
			for (let i in structures) {
				let structure = structures[i];
				//f.debug('link: '+JSON.stringify(structure.id));
				let pos = structure.pos;
				let closest = pos.findClosestByRange(FIND_STRUCTURES,{
					filter: {structureType: STRUCTURE_CONTAINER}
				});
				//f.debug('closestContainer: '+JSON.stringify(closest.id));
				let distance = closest.pos.getRangeTo(structure);
				//f.debug('distance: '+distance);
				if (distance < closestDistance) {
					closestDistance = distance;
					linkWithClosest = structure;
				}
			}
			if (linkWithClosest &&
				linkWithClosest.energy < linkWithClosest.energyCapacity
			) {
				let type = 'transfer';
				let target = linkWithClosest.id;
				let resourceType = RESOURCE_ENERGY;
				let creepType = 'A';
				let jobCount = c.job.linkSupply.count;
				let jobPrio = c.job.linkSupply.priority;
				if(countJobs(type, target) < jobCount) {
					createJob(type, target, resourceType, creepType, jobPrio);
				}
			}

			// Tower supply job
			var structures = room.find(FIND_MY_STRUCTURES,{
				filter: s => s.structureType == STRUCTURE_TOWER
					&& s.energy < s.energyCapacity
			});
			for (let i in structures) {
				let structure = structures[i];
				let type = 'transfer';
				let target = structure.id;
				let resourceType = RESOURCE_ENERGY;
				let creepType = 'A';
				let jobCount = c.job.towerSupply.count;
				let jobPrio = c.job.towerSupply.priority;
				if(countJobs(type, target) < jobCount) {
					createJob(type, target, resourceType, creepType, jobPrio);
				}
			}

			// Mineral harvester job
			var extractor = room.find(FIND_MY_STRUCTURES, {
				filter: {structureType: STRUCTURE_EXTRACTOR}
			})[0];
			if (extractor &&
				room.storage &&
				_.sum(room.storage.store) < room.storage.storeCapacity
			) {
				let mineral = extractor.pos.lookFor(LOOK_MINERALS)[0];
				let type = 'mineral';
				let target = mineral.id;
				let resourceType = mineral.mineralType;
				let creepType = 'A';
				let jobCount = c.job.mineralHarvest.count;
				let jobPrio = c.job.mineralHarvest.priority;
				if(countJobs(type, target) < jobCount) {
					createJob(type, target, resourceType, creepType, jobPrio);
				}
			}

		}
	},

	getJob(creepType) {
		// Get unassigned jobs
		let jobs = _.filter(Memory.jobQueue, {
			creepType:creepType,
			assignedTo:''
		});
		if (!jobs.length) return false;
		// Sort by priority
		if(jobs.length > 1)	jobs = _.sortBy(jobs, 'priority');
		return jobs[0];
	},

	assignJob(job, creep) {
		creep.memory.job = job.id;
		Memory.jobQueue[job.id].assignedTo = creep.name;
		f.debug('Job assigned '+job.type+' '+creep.name+' '+job.id);
	},

	unassignJob(jobId) {
		// Unassign job from creep
		for (let creepName in Memory.creeps) {
			if (Memory.creeps[creepName].job == jobId) {
				Memory.creeps[creepName].job = '';
			}
		}
		// Unassign creep from job
		if(Memory.jobQueue[jobId]) {
			let job = Memory.jobQueue[jobId];
			f.debug('Job unassigned '+job.type+' '+job.assignedTo+' '+job.id);
			Memory.jobQueue[jobId].assignedTo = '';
		}
	},

	removeJob(jobId) {
		// Get job
		let job = Memory.jobQueue[jobId];
		// Unassign job from creep
		for (let creepName in Memory.creeps) {
			if (Memory.creeps[creepName].job == jobId) {
				delete Memory.creeps[creepName].job;
			}
		}
		// Remove job from queue
		delete Memory.jobQueue[jobId];
		f.debug('Job removed '+job.type+' '+job.assignedTo+' '+jobId);
	},

}

function generateId() {
	while (true) {
		let id = 'j' + getRndInteger(1000,9999);
		if (!Memory.jobQueue.id) return id;
	}
}

function countJobs(type, target) {
	let jobs = _.filter(Memory.jobQueue, {type:type, target:target});
	return jobs.length;
}

function createJob(type, target, resourceType, creepType, priority = 3) {
	let id = generateId();
	Memory.jobQueue[id] = {
		id:id,
		type:type,
		target:target,
		resourceType:resourceType,
		creepType:creepType,
		assignedTo:'',
		priority:priority,
	};

	let targetStructureType = Game.getObjectById(target).structureType;
	let targetString = targetStructureType+'('+target.substring(0,3)+')';
	f.debug('Job created '+type+' '+targetString+' '+id);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}