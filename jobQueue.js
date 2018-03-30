var f = require('functions');
if(!Memory.jobQueue) Memory.jobQueue = [];

module.exports = {
	
	generateJobs() {
		
		// Spawn supply
		for (let spawnName in Game.spawns) {
			let spawn = Game.spawns[spawnName];
			if (spawn.energy == spawn.energyCapacity) continue;
			
			let job = 'transfer';
			let target = spawn.id;
			let resourceType = RESOURCE_ENERGY;
			let creepType = 'A';
			if(!jobExists(job, target)) {
				createJob(job, target, resourceType, creepType);
			}
		}
		
		// Upgrade room controller job
		
		
	},

}

function getJobId() {
	for(let i = 0; i < 1024; i++) {
		if (!Memory.jobQueue[i]) return i;
	}
}

function jobExists(job, target) {
	let jobs = _.filter(Memory.jobQueue, {job:job, target:target});
	if (jobs.length) return true;
	else return false;
}

function createJob(job, target, resourceType, creepType) {
	let id = getJobId();
	 Memory.jobQueue[id] = {
		 job:job,
		 target:target,
		 resourceType:resourceType,
		 creepType:creepType,
		 assignedTo:'',
	};
	f.debug('Job created: '+id);
}