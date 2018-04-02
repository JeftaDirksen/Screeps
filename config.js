module.exports = {
	debug: true,
	cpu: false,
	maxConstructionSites: 1,
	pathUseMinimumTimesUsed: 10,
	pathUseRemoveAge: 100,
	creepTypeCount: {
		A: 5,
		B: 0,
	},
	jobCount: {
		spawnSupply: 1,
		upgradeController: 3,
		build: 2,
		harvest: 2,
	},
	jobPriority: {
		spawnSupply: 1,
		harvest: 2,
		build: 3,
		upgradeController: 5,
	}
};
