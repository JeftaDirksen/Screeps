module.exports = {
	debug: true,
	cpu: false,
	maxConstructionSites: 1,
	pathUseMinimumTimesUsed: 10,
	pathUseRemoveAge: 100,
	creepTypeCount: {
		A: 9,
		B: 1,
	},
	jobCount: {
		spawnSupply: 1,
		upgrade: 3,
		build: 2,
		harvest: 3,
		repair: 1,
		linkSupply: 1,
		towerSupply: 1,
	},
	jobPriority: {
		spawnSupply: 1,
		harvest: 2,
		towerSupply: 2,
		linkSupply: 3,
		repair: 3,
		build: 4,
		upgrade: 5,
	}
};
