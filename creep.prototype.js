var c = require('config');
var f = require('functions');

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
	// goWithdraw
	if (energyStore) this.goWithdraw(energyStore, RESOURCE_ENERGY);

	// Get dropped energy
	else {
		let droppedEnergy = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
			filter: {resourceType: RESOURCE_ENERGY}
		});
		if(droppedEnergy) {
			let r = this.pickup(droppedEnergy);
			if (r == ERR_NOT_IN_RANGE) this.goTo(droppedEnergy);
		}
		
		// goIdle
		else this.goIdle();
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

// goIdle
Creep.prototype.goIdle = function() {
	this.goTo(this.room.controller);
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

// goWithdraw
Creep.prototype.goWithdraw = function(structure, resourceType) {
	let r = this.withdraw(structure, resourceType);
	if(r == ERR_NOT_IN_RANGE) this.goTo(structure);
	return r;
}

// isEmpty
Creep.prototype.isEmpty = function () {
    return !_.sum(this.carry);
}

// isFull
Creep.prototype.isFull = function () {
    return _.sum(this.carry) == this.carryCapacity;
}
