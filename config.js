module.exports = {
	debug: true,
	sign: '',
	creep: {
		type: {
			a: [
				{cost:  250, body: [MOVE, MOVE, CARRY, WORK]},
				{cost:  500, body: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK]},
				{cost: 1000, body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK]},
			],
			b: [
				{cost:  200, body: [MOVE, MOVE, CARRY, CARRY]},
				{cost:  400, body: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]},
				{cost:  800, body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]},
				{cost: 1600, body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]},
			],
			c: [
				{cost:  650, body: [MOVE, CLAIM]},
			],
		},
		role: {
			harvester: {
				count: 7,
				creepType: 'a',
			},
			transporter: {
				count: 2,
				creepType: 'b',
			},
			builder: {
				count: 2,
				creepType: 'a',
			},
			upgrader: {
				count: 1,
				creepType: 'a',
			},
			claimer: {
				count: 1,
				creepType: 'c',
			},
		},
	},
};
