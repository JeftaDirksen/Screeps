module.exports = {
	debug: true,
	creep: {
		type: {
			a: [
				{cost:  250, body: [MOVE, MOVE, CARRY, WORK]},
				{cost:  500, body: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK]},
				{cost: 1000, body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK]},
			],
			b: [
				{cost: 260, body: [MOVE, MOVE, ATTACK, ATTACK]},
			],
		},
		role: {
			harvester: {
				count: 7,
				creepType: 'a',
			},
			transporter: {
				count: 2,
				creepType: 'a',
			},
			builder: {
				count: 2,
				creepType: 'a',
			},
			upgrader: {
				count: 1,
				creepType: 'a',
			},
		},
	},
};
