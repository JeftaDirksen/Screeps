var c = require('config');
var f = require('functions');

module.exports = {
	
	generateJobs() {
		f.cpu('jobQueue.generateJobs');

		// For every room
		for (let roomName in Game.rooms) {
			let room = Game.rooms[roomName];

			// Spawn/extension supply job
			let structures = room.find(FIND_MY_STRUCTURES,{
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
				let jobCount = c.jobCount.spawnSupply;
				let jobPrio = c.jobPriority.spawnSupply;
				if(countJobs(type, target) < jobCount) {
					createJob(type, target, resourceType, creepType, jobPrio);
				}
			}
			
			// Upgrade room controller job
			let type = 'upgradeController';
			let target = room.controller.id;
			let resourceType = RESOURCE_ENERGY;
			let creepType = 'A';
			let jobCount = c.jobCount.upgradeController;
			let jobPrio = c.jobPriority.upgradeController;
			if(countJobs(type, target) < jobCount) {
				createJob(type, target, resourceType, creepType, jobPrio);
			}
		
			// Build Construction sites job
			let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
			for (let i in constructionSites) {
				let site = constructionSites[i];
				let type = 'build';
				let target = site.id;
				let resourceType = RESOURCE_ENERGY;
				let creepType = 'A';
				let jobCount = c.jobCount.build;
				let jobPrio = c.jobPriority.build;
				if(countJobs(type, target) < jobCount) {
					createJob(type, target, resourceType, creepType, jobPrio);
				}
			}

			// Harvester job
			structures = room.find(FIND_STRUCTURES,{
				filter: s => (s.structureType == STRUCTURE_LINK
					|| s.structureType == STRUCTURE_STORAGE
					|| s.structureType == STRUCTURE_CONTAINER)
					&& (s.energy < s.energyCapacity
					|| _.sum(s.store) < s.storeCapacity)
			});
			for (let i in structures) {
				let structure = structures[i];
				let type = 'harvest';
				let target = structure.id;
				let resourceType = RESOURCE_ENERGY;
				let creepType = 'A';
				let jobCount = c.jobCount.harvest;
				let jobPrio = c.jobPriority.harvest;
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
	let chars = 'abcdef0123456789'.split('');
	let id = '';
	for(let i = 0; i < 24; i++) {
		let rnd = Math.floor(Math.random()*chars.length);
		let char = chars[rnd];
		id += char;
	}
	return id;
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
	f.debug('Job created '+type+' '+target+' '+id);
}
