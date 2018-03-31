var f = require('functions');
var jq = require('jobQueue');
var jobs = require('jobs');

// getFreeCapacity
Creep.prototype.getFreeCapacity = function() {
	return this.carryCapacity - _.sum(this.carry);
}

// goGetEnergy
Creep.prototype.goGetEnergy = function() {
	// Get dropped energy in range
	let droppedEnergy = this.pos.findClosestByPathInRange(FIND_DROPPED_RESOURCES, 5);
	if (droppedEnergy) {
		this.goPickup(droppedEnergy);
		return;
	}

	// Get energy from storage/container/link (with enough energy)
	var energyStore = this.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) => (
			s.structureType == STRUCTURE_STORAGE
			|| s.structureType == STRUCTURE_CONTAINER
			|| s.structureType == STRUCTURE_LINK
		) && (
			s.energy >= this.getFreeCapacity()
			|| (s.store && s.store.energy >= this.getFreeCapacity())
		)
	});
	if (energyStore) this.goWithdraw(energyStore, RESOURCE_ENERGY);

	// Harvest
	else {
		this.goHarvest();
	}
}

// goHarvest
Creep.prototype.goHarvest = function() {
	var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
	if (source) {
		if (this.harvest(source) == ERR_NOT_IN_RANGE) {
			this.goTo(source);
		}
	}
}

// goPickup
Creep.prototype.goPickup = function(item) {
	if(this.pickup(item) == ERR_NOT_IN_RANGE) {
		this.goTo(item);
	}
}

// goTo
Creep.prototype.goTo = function(target) {
	let r = this.moveTo(target);
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

// goTransfer
Creep.prototype.goTransfer = function(structure, resourceType) {
	if (this.transfer(structure, resourceType) == ERR_NOT_IN_RANGE) {
		this.goTo(structure);
	}
}

// goUpgradeController
Creep.prototype.goUpgradeController = function() {
	if (this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
		this.goTo(this.room.controller);
	}
}

// goWithdraw
Creep.prototype.goWithdraw = function(structure, resourceType) {
	if(this.withdraw(structure, resourceType) == ERR_NOT_IN_RANGE) {
		this.goTo(structure);
	}
}

// hasResource
Creep.prototype.hasResource = function(resourceType) {
    return this.carry[resourceType] > 0;
}

// isFull
Creep.prototype.isFull = function () {
    return _.sum(this.carry) == this.carryCapacity;
}

// run
Creep.prototype.run = function() {

    // Check job / Get job
    if (!this.memory.job) {
        let job = jq.getJob(this.memory.type);
        if (job) {
            jq.assignJob(job, this);
        }
        else return;
    }

    // Run job
    jobs.run(this);

}

