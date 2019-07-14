var c = require('config');
var f = require('functions');

module.exports = function (creep) {
    // Check if empty
    if(creep.memory.transport && creep.isEmpty()) {
        creep.memory.transport = false;
    }
    // Check if full
    if(!creep.memory.transport && creep.isFull()) {
        creep.memory.transport = true;
    }

    // Transport
    if(creep.memory.transport) {
        // Supply links when <20% full
        if(linkSystemPercentage(creep.room) < 20) {
            let links = creep.room.find(FIND_MY_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_LINK
            });
            if(links.length) {
                let link = creep.pos.findClosestByPath(links);
                let r = creep.transfer(link, RESOURCE_ENERGY);
                if(r == ERR_NOT_IN_RANGE) creep.goTo(link);
                return r;
            }
        }
        
        // Supply spawn/extensions
        let spawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
            filter: s => (
                s.structureType == STRUCTURE_SPAWN
                || s.structureType == STRUCTURE_EXTENSION
            ) && s.energy < s.energyCapacity
        });
        if(spawn) {
            let r = creep.transfer(spawn, RESOURCE_ENERGY);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(spawn);
            else if (r) f.error('creep.transfer '+r);
            return;
        }

        // Supply tower
        let tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
            filter: s => (
                s.structureType == STRUCTURE_TOWER
            ) && s.energy < s.energyCapacity
        });
        if(tower) {
            let r = creep.transfer(tower, RESOURCE_ENERGY);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(tower);
            else if (r) f.error('creep.transfer '+r);
            return;
        }
        
        // Supply container/storage when link-system >80% full
        if(linkSystemPercentage(creep.room) > 80) {
            let storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
                filter: s => (
                    s.structureType == STRUCTURE_CONTAINER
                    || s.structureType == STRUCTURE_STORAGE
                ) && s.energy < s.energyCapacity || _.sum(s.store) < s.storeCapacity
            });
            if(storage) {
                let r = creep.transfer(storage, RESOURCE_ENERGY);
                if(r == ERR_NOT_IN_RANGE) creep.goTo(storage);
                else if (r) f.error('creep.transfer '+r);
                return;
            }
        }
        
        // Supply storage when containers >80% full
        const nrOfStorages = creep.room.find(FIND_MY_STRUCTURES, {
            filter: s => 
                s.structureType == STRUCTURE_STORAGE
                && _.sum(s.store) < s.storeCapacity
        }).length;
        let containers = creep.room.find(FIND_STRUCTURES,{filter:{structureType:STRUCTURE_CONTAINER}});
        if (nrOfStorages && containers.length) {
            const containersAmountStored = _.sum(containers, c => _.sum(c.store));
            const containersStorageCapacity = _.sum(containers, c => c.storeCapacity);
            const containersFullPercent = containersAmountStored / containersStorageCapacity * 100;
            if(containersFullPercent > 80) {
                let storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
                    filter: s => (
                        s.structureType == STRUCTURE_STORAGE
                    ) && _.sum(s.store) < s.storeCapacity
                });
                if(storage) {
                    f.debug(creep.name+' supplying storage because containers full');
                    let r = creep.transfer(storage, RESOURCE_ENERGY);
                    if(r == ERR_NOT_IN_RANGE) creep.goTo(storage);
                    else if (r) f.error('creep.transfer '+r);
                    return;
                }
            }
        }
    }

    // Load
    else {
        // Get from link when link-system >80% full
        if(linkSystemPercentage(creep.room) > 80) {
            // Get energy from link
            let links = creep.room.find(FIND_MY_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_LINK
            });
            if(links.length) {
                let link = creep.pos.findClosestByPath(links);
                let r = creep.withdraw(link, RESOURCE_ENERGY);
                if(r == ERR_NOT_IN_RANGE) creep.goTo(link);
                return r;
            }
        }

        else {
            // Get energy from storage/container/link (with enough energy)
            let structures = creep.room.find(FIND_STRUCTURES, {
                filter: s => (
                    s.structureType == STRUCTURE_STORAGE
                    || s.structureType == STRUCTURE_CONTAINER
                    || (s.structureType == STRUCTURE_LINK && linkSystemPercentage(creep.room) > 50)
                ) && (
                    s.energy || (s.store && s.store.energy)
                )
            });
            if(structures.length) {
                let structure = creep.pos.findClosestByPath(structures);
                let r = creep.withdraw(structure, RESOURCE_ENERGY);
                if(r == ERR_NOT_IN_RANGE) creep.goTo(structure);
                return r;
            }
            else {
                // Get dropped energy
                let energyDrops = creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: e => e.resourceType == RESOURCE_ENERGY
                });
                if(energyDrops.length) {
                    let energyDrop = creep.pos.findClosestByPath(energyDrops);
                    let r = creep.pickup(energyDrop);
                    if(r == ERR_NOT_IN_RANGE) creep.goTo(energyDrop);
                    return r;
                }
            }
        }

    }

    // goIdle
    creep.goIdle();

}

function linkSystemPercentage(room) {
    // Get links
    let links = room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_LINK
    });
    if(links.length) {
        let linksEnergy = _.sum(links, function(o){return o.energy;});
        let linksEnergyCapacity = _.sum(links, function(o){return o.energyCapacity;});
        return Math.round(linksEnergy/linksEnergyCapacity*100);
    }
    else return false;
}