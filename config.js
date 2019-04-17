module.exports = {
    creep: {
        type: {
            a: [
                {cost:  250, body: [MOVE, WORK, WORK]},
                {cost:  250, body: [MOVE, WORK, WORK, WORK]},
                {cost:  250, body: [MOVE, WORK, WORK]},
                {cost:  250, body: [MOVE, WORK, WORK]},
            ],
            b: [
                {cost:  200, body: [MOVE, MOVE, CARRY, CARRY]},
                {cost:  400, body: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]},
                {cost:  800, body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]},
                {cost: 1600, body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]},
            ],
            c: [
				{cost:  250, body: [MOVE, MOVE, CARRY, WORK]},
				{cost:  400, body: [MOVE, MOVE, MOVE, CARRY, WORK, WORK]},
				{cost:  500, body: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK]},
				{cost: 1000, body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK]},
				{cost: 1750, body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK]},
            ],
            d: [
                {cost:  650, body: [MOVE, CLAIM]},
            ],
        },
        role: {
            harvester: {
                defaultAmount: 2,
                creepType: 'a',
            },
            transporter: {
                defaultAmount: 2,
                creepType: 'b',
            },
            builder: {
                defaultAmount: 2,
                creepType: 'c',
            },
        },
    },
};
