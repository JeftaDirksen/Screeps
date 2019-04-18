module.exports = {
    creep: {
        type: {
            a: [
                {cost:  250, body: [MOVE, WORK, WORK]},
                {cost:  500, body: [MOVE, MOVE, WORK, WORK, WORK, WORK]},
                {cost: 1000, body: [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]},
            ],
            b: [
                {cost:  200, body: [MOVE, MOVE, CARRY, CARRY]},
                {cost:  400, body: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]},
                {cost:  800, body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]},
            ],
            c: [
                {cost:  250, body: [MOVE, MOVE, CARRY, WORK]},
                {cost:  400, body: [MOVE, MOVE, MOVE, CARRY, WORK, WORK]},
                {cost:  500, body: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK]},
                {cost: 1000, body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK]},
            ],
            d: [
                {cost: 900, body: [MOVE, MOVE, MOVE, CARRY, WORK, CLAIM]},
            ],
        },
        role: {
            harvester: {
                defaultAmount: 2,
                creepType: 'a',
            },
            collector: {
                defaultAmount: 2,
                creepType: 'b',
            },
            builder: {
                defaultAmount: 2,
                creepType: 'c',
            },
            upgrader: {
                defaultAmount: 1,
                creepType: 'c',
            },
            transporter: {
                defaultAmount: 2,
                creepType: 'b',
            },
            roomClaimer: {
                defaultAmount: 5,
                creepType: 'd',
            },
        },
    },
};
