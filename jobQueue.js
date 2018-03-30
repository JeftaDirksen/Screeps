var f = require('functions');
if(!Memory.jobQueue) Memory.jobQueue = {};

module.exports = {
	
	generateJobs() {
		
		// Spawn supply
		for (let spawnName in Game.spawns) {
			let spawn = Game.spawns[spawnName];
			if (spawn.energy == spawn.energyCapacity) continue;
			
			let type = 'transfer';
			let target = spawn.id;
			let resourceType = RESOURCE_ENERGY;
			let creepType = 'A';
			if(!jobExists(type, target)) {
				createJob(type, target, resourceType, creepType);
			}
		}
		
		// Upgrade room controller job
		
		
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
		Memory.jobQueue[jobId].assignedTo = '';
	}

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

function jobExists(type, target) {
	let jobs = _.filter(Memory.jobQueue, {type:type, target:target});
	if (jobs.length) return true;
	else return false;
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
	f.debug('Job created: '+id);
}