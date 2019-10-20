// goTo
Creep.prototype.goTo = function(target, maxRooms = 1) {
    let r = this.moveTo(target,{
        visualizePathStyle: {},
        reusePath: 5,
        maxRooms: maxRooms,
    });
    switch(r) {
        case OK:
            break;
        case ERR_TIRED:
            this.say('.');
            break;
        case ERR_NO_PATH:
            this.say('?');
            break;
        case ERR_INVALID_TARGET:
            this.say('??');
            break;
        default:
            this.say(r);
    }
    return r;
}

// isEmpty
Creep.prototype.isEmpty = function() {
    return !_.sum(this.carry);
}

// isFull
Creep.prototype.isFull = function() {
    return _.sum(this.carry) == this.carryCapacity;
}

// getEnergy
Creep.prototype.getEnergy = function() {
    // Structures
    let energySources = this.room.find(FIND_STRUCTURES, {
        filter: s => (
            s.structureType == STRUCTURE_STORAGE
            || s.structureType == STRUCTURE_CONTAINER
            || s.structureType == STRUCTURE_LINK
        ) && s.store[RESOURCE_ENERGY]
    });
    // Tombstones
    energySources = energySources.concat(this.room.find(FIND_TOMBSTONES, {
        filter: t => t.store[RESOURCE_ENERGY]
    }));    
    // Dropped energy
    energySources = energySources.concat(this.room.find(FIND_DROPPED_RESOURCES, {
            filter: { resourceType: RESOURCE_ENERGY }
    }));
    if(energySources.length) {
        let energy = this.pos.findClosestByPath(energySources);
        let r = this.withdraw(energy, RESOURCE_ENERGY);
        if (r == ERR_INVALID_TARGET) r = this.pickup(energy);
        if (r == ERR_NOT_IN_RANGE) this.goTo(energy);
    }
    
}
