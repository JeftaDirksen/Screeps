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
			if(countJobs(type, target) < 2) {
				createJob(type, target, resourceType, creepType);
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
			if(countJobs(type, target) < 2) {
				createJob(type, target, resourceType, creepType);
			}
		}
		
	},

	getJob(creepType) {
		let jobs = _.filter(Memory.jobQueue, {
			creepType:creepType,
			assignedTo:''
		});
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
		let creepName = _.filter(Memory.creeps,{job:jobId})[0];
		let creep = Game.creeps[creepName];
		if(creep) delete creep.memory.job;
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

function createJob(type, target, resourceType, creepType) {
	let id = generateId();
	Memory.jobQueue[id] = {
		id:id,
		type:type,
		target:target,
		resourceType:resourceType,
		creepType:creepType,
		assignedTo:'',
	};
	f.debug('Job created: '+id+' '+type+' '+target);
}