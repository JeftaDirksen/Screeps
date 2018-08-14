var f = require('functions');
var jq = require('jobQueue');
var jobs = require('jobs');
var roads = require('roads');

// getFreeCapacity
Creep.prototype.getFreeCapacity = function() {
	return this.carryCapacity - _.sum(this.carry);
}

// goBuild
Creep.prototype.goBuild = function(site) {
	let r = this.build(site);
	if (r == ERR_NOT_IN_RANGE) this.goTo(site);
	return r;
}

// goGetEnergy
Creep.prototype.goGetEnergy = function(includeLink = true) {
	// Get dropped energy in range
	let droppedEnergy = this.pos.findClosestByPathInRange(FIND_DROPPED_RESOURCES, 5);
	if (droppedEnergy) {
		this.goPickup(droppedEnergy);
		return;
	}

	// Get energy from storage/container/link (with enough energy)
	if(includeLink) {
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
	}
	// Get energy from storage/container (with enough energy)
	else {
		var energyStore = this.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (s) => (
				s.structureType == STRUCTURE_STORAGE
				|| s.structureType == STRUCTURE_CONTAINER
			) && s.store.energy >= this.getFreeCapacity()
		});
	}
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
		let r = this.harvest(source);
		if (r == ERR_NOT_IN_RANGE) this.goTo(source);
		return r;
	}
}

// goHarvestMineral
Creep.prototype.goHarvestMineral = function(mineral) {
	let r = this.harvest(mineral);
	if (r == ERR_NOT_IN_RANGE) this.goTo(mineral);
	return r;
}

Creep.prototype.goIdle = function() {
	this.goTo(Game.flags.Idle);
}

// goPickup
Creep.prototype.goPickup = function(item) {
	let r = this.pickup(item);
	if(r == ERR_NOT_IN_RANGE) this.goTo(item);
	return r;
}

// goRepair
Creep.prototype.goRepair = function(structure) {
	let r = this.repair(structure);
	if (r == ERR_NOT_IN_RANGE) this.goTo(structure);
	return r;
}

// goTo
Creep.prototype.goTo = function(target) {
	let r = this.moveTo(target);
	switch(r) {
		case OK:
			break;
		case ERR_TIRED:
			this.say('.');
			roads.registerPath(this.pos);
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
	let r = this.transfer(structure, resourceType);
	if (r == ERR_NOT_IN_RANGE) this.goTo(structure);
	return r;
}

// goUpgradeController
Creep.prototype.goUpgradeController = function() {
	let r = this.upgradeController(this.room.controller);
	if (r == ERR_NOT_IN_RANGE) this.goTo(this.room.controller);
	return r;
}

// goWithdraw
Creep.prototype.goWithdraw = function(structure, resourceType) {
	let r = this.withdraw(structure, resourceType);
	if(r == ERR_NOT_IN_RANGE) this.goTo(structure);
	return r;
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
    // Renew when needed
	if(this.memory.renew && this.ticksToLive >= 1000) {
		this.memory.renew = false;
	}
	if(this.memory.renew || this.ticksToLive < 50) {
		this.say('^');
		if(!this.memory.renew) f.debug('Creep '+this.name+' needs to renew');
		this.memory.renew = true;
		jq.unassignJob(this.memory.job);
		let spawn = this.pos.findClosestByPath(FIND_MY_SPAWNS);
		this.goTo(spawn);
		return;
	}
	
	// Run job
    if (this.memory.job) jobs.run(this);

    // Check job / Get job
    else {
        let newJob = jq.getJob(this.memory.type);
        if (newJob) jq.assignJob(newJob, this);
		else this.goIdle();
    }
}

