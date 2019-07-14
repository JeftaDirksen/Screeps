var c = require('config');
var f = require('functions');

module.exports = function() {
    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];

        checkSpawnMemory(spawn);

        if (spawn.spawning) continue;

        // Get energy stats
        let energyCapacity = spawn.room.energyCapacityAvailable;
        let energyAvailable = spawn.room.energyAvailable;

        // Spawn failure checks/fixes
        // Harvester required
        let harvesters = spawn.room.find(FIND_MY_CREEPS,{
                filter: c => c.memory.role == 'harvester'
        }).length;
        if(!harvesters) energyCapacity = 300;
        // Transporter required
        let transporters = spawn.room.find(FIND_MY_CREEPS,{
                filter: c => c.memory.role == 'transporter'
        }).length;
        if(!transporters) energyCapacity = 300;

        // Check if energy full
        if(energyAvailable < energyCapacity) continue;

        // Check roles for needed creeps
        for(let roleName in c.creep.role) {
            if (roleNeedsCreep(spawn, roleName)) {
                if (buildCreep(spawn, roleName, energyAvailable)) break;
            }
        }
    }
}

function roleNeedsCreep(spawn, roleName) {
    let role = c.creep.role[roleName];

    // roomClaimer
    if(roleName == 'roomClaimer') {
        if(!spawn.memory.claim) return false;
        
        // Check GCL (GCL >= Amount of claimed rooms)
        let controlledRooms = _.filter(Game.rooms, r => r.controller.my).length;
        let gcl = Game.gcl.level;
        if(gcl <= controlledRooms) return false;

        // Check if claim complete
        if(
            Game.rooms[spawn.memory.claim] &&
            Game.rooms[spawn.memory.claim].controller.my &&
            Game.rooms[spawn.memory.claim].find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_SPAWN }
            }).length
        ) {
            f.debug('Claim completed ('+ spawn.memory.claim +')');
            spawn.memory.claim = null;
            return false;
        }

        // Check if build enough roomClaimers (in all rooms)
        let currentCount = _.filter(Game.creeps,{memory: {role: 'roomClaimer'}}).length;
        let toBuildCount = spawn.memory[roleName+'s'];
        if(currentCount >= toBuildCount) return false;
        else return true;
    }

    // Check if build enough already
    let currentCount = _.filter(Game.creeps, {
        memory: {role: roleName, room: spawn.room.name}
    }).length;
    let toBuildCount = spawn.memory[roleName+'s'];
    if(currentCount >= toBuildCount) return false;

    // Builder only when constructionSite exists
    if(roleName == 'builder') {
        let sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length;
        if(!sites) return false;
    }
    
    // Upgrader/Transporter only when container/storage exists
    if(roleName == 'upgrader' || roleName == 'transporter') {
        let containers = spawn.room.find(FIND_STRUCTURES, {
            filter: s => (
                s.structureType == STRUCTURE_CONTAINER
                || s.structureType == STRUCTURE_STORAGE
                || s.structureType == STRUCTURE_LINK
            )
        }).length
        if(!containers) return false;
    }

    // Repairer only when no towers
    if(roleName == 'repairer') {
        let towers = spawn.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        }).length;
        if(towers) return false;
    }
    
    return true;
}

function checkSpawnMemory(spawn) {
    for(let roleName in c.creep.role) {
        if(!(spawn.memory[roleName+'s'] >= 0)) {
            spawn.memory[roleName+'s'] = c.creep.role[roleName].defaultAmount;
        }
    }
    if(spawn.memory.claim == undefined) spawn.memory.claim = null;
}

function buildCreep(spawn, roleName, energy) {
    let role = c.creep.role[roleName];

    // Get body
    let body = getBody(role.creepType, energy);
    if(!body) return false;

    // Name / Memory
    let name = generateName(roleName);
    let memory = {memory:{role:roleName,room:spawn.room.name}};

    // Role specific memory
    if(roleName == 'roomClaimer') {
        //let roomName = Game.rooms[spawn.memory.claim].name;
        memory = {memory:{role:roleName,room:spawn.memory.claim}};
    }

    // Build creep
    let r = spawn.spawnCreep(body, name, memory);
    if(r) {
        f.error('spawn.spawnCreep '+r);
        return false;
    }
    else {
        f.debug(spawn.name + ' (' + spawn.room.name + ') spawning creep ' + name);
        return true;
    }
}

function generateName(role) {
    let r = role.charAt(0).toUpperCase();
    for(let i = 1; i<=100; i++) {
        let name = r+i;
        if(!Game.creeps[name]) {
            return name;
        }
    }
    f.error('Name generation failed ('+type+')');
}

function getBody(type, energy) {
    let bodies = c.creep.type[type];
    for(let i = bodies.length-1; i >= 0; i-- ) {
        let body = c.creep.type[type][i];
        if(body.cost <= energy) return body.body;
    }
}