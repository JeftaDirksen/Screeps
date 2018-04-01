var c = require('config');
var f = require('functions');

module.exports = {
	
	generateJobs() {
		f.cpu('jobQueue.generateJobs');

		// Spawn supply job
		for (let spawnName in Game.spawns) {
			let spawn = Game.spawns[spawnName];
			if (spawn.energy == spawn.energyCapacity) continue;
			
			let type = 'transfer';
			let target = spawn.id;
			let resourceType = RESOURCE_ENERGY;
			let creepType = 'A';
			if(countJobs(type, target) < c.jobCount.spawnSupply) {
				createJob(type, target, resourceType, creepType, 1);
			}
		}
		
		// Upgrade room controller job
		for (let roomName in Game.rooms) {
			let room = Game.rooms[roomName];
			let rc = room.controller;
			
			let type = 'upgradeController';
			let target = rc.id;
			let resourceType = RESOURCE_ENERGY;
			let creepType = 'A';
			if(countJobs(type, target) < c.jobCount.upgradeController) {
				createJob(type, target, resourceType, creepType, 4);
			}
		}
	
		// Build Construction sites job
		for (let siteId in Game.constructionSites) {
			let site = Game.constructionSites[siteId];
			let type = 'build';
			let target = siteId;
			let resourceType = RESOURCE_ENERGY;
			let creepType = 'A';
			if(countJobs(type, target) < c.jobCount.build) {
				createJob(type, target, resourceType, creepType);
			}
		}

	},

	getJob(creepType) {
		// Get unassigned jobs
		let jobs = _.filter(Memory.jobQueue, {
			creepType:creepType,
			assignedTo:''
		});
		f.debug('unsorted: '+JSON.stringify(jobs));
		// Sort priority
		jobs = _.sortBy(jobs, 'priority');
		f.debug('sorted: '+JSON.stringify(jobs));
		if(jobs.length > 0) return jobs[0];
		else return false;
	},

	assignJob(job, creep) {
		creep.memory.job = job.id;
		Memory.jobQueue[job.id].assignedTo = creep.name;
	},

	unassignJob(jobId) {
		if(Memory.jobQueue[jobId]) Memory.jobQueue[jobId].assignedTo = '';
	},

	removeJob(jobId) {
		// Unassign job from creep
		for (let creepName in Memory.creeps) {
			if (Memory.creeps[creepName].job == jobId) {
				delete Memory.creeps[creepName].job;
			}
		}
		// Remove job from queue
		delete Memory.jobQueue[jobId];
		f.debug('Job removed: '+jobId);
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
	f.debug('Job created: '+id+' '+type+' '+target);
}