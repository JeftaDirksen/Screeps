// Level energy caps: 300 550 800 1300 1800 2300 5300 12300
module.exports = {
    creep: {
        type: {
            a: [
                {cost:   250, body: [MOVE, MOVE, CARRY, WORK]},
                {cost:   500, body: [MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK]},
                {cost:   750, body: [MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK]},
                {cost:  1250, body: [MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK]},
                {cost:  1750, body: [MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK]},
                {cost:  2250, body: [MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK]},
                {cost:  3000, body: [MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK, MOVE, MOVE, CARRY, WORK]},
            ],
            b: [
                {cost:   200, body: [MOVE, MOVE, CARRY, CARRY]},
                {cost:   400, body: [MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY]},
                {cost:   800, body: [MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY]},
                {cost:  1200, body: [MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY]},
                {cost:  1800, body: [MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY]},
                {cost:  2200, body: [MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY]},
                {cost:  2400, body: [MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY]},
            ],
            c: [
                {cost:   900, body: [MOVE, MOVE, MOVE, CARRY, WORK, CLAIM]},
                {cost:  1800, body: [MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM]},
                {cost:  4500, body: [MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM]},
                {cost:  7200, body: [MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM, MOVE, MOVE, MOVE, CARRY, WORK, CLAIM]},
            ],
        },
        role: {
            harvester: {
                defaultAmount: 4,
                creepType: 'a',
            },
            supplier: {
                defaultAmount: 1,
                creepType: 'b',
            },
            collector: {
                defaultAmount: 1,
                creepType: 'b',
            },
            upgrader: {
                defaultAmount: 1,
                creepType: 'a',
            },
            builder: {
                defaultAmount: 2,
                creepType: 'a',
            },
            repairer: {
                defaultAmount: 1,
                creepType: 'a',
            },
            roomClaimer: {
                defaultAmount: 5,
                creepType: 'c',
            },
        },
    },
};
