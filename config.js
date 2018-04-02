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
		upgradeController: 3,
		build: 2,
		harvest: 2,
		repair: 1,
	},
	jobPriority: {
		spawnSupply: 1,
		harvest: 2,
		repair: 3,
		build: 4,
		upgradeController: 5,
	}
};
