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
Creep.prototype.goGetEnergy = function() {
	// Get energy from storage/container/link (with enough energy)
	let structures = this.room.find(FIND_STRUCTURES, {
		filter: s => (
			s.structureType == STRUCTURE_STORAGE
			|| s.structureType == STRUCTURE_CONTAINER
			|| s.structureType == STRUCTURE_LINK
		) && (
			s.energy || (s.store && s.store.energy)
		)
	});
	
	// Get dropped energy
	let dropped = this.room.find(FIND_DROPPED_RESOURCES, {
		filter: e => e.resourceType == RESOURCE_ENERGY
	});

	// Get tombstone energy
	let tombstone = this.room.find(FIND_TOMBSTONES, {
		filter: t => t.store.energy
	});
	
	// Combine/Get closest
	let energy = structures.concat(dropped).concat(tombstone);
	energy = this.pos.findClosestByPath(energy);
	if(energy && (energy instanceof Structure || energy instanceof Tombstone))
		return this.goWithdraw(energy, RESOURCE_ENERGY);
	if(energy && energy instanceof Resource)
		return this.goPickup(energy);
	
	// goIdle
	this.goIdle();
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
	// Reset ticksIdle if not idle last tick
	if(this.memory.lastIdleTick != Game.time-1) this.memory.ticksIdle = 0;
	// Increase ticks idle
	this.memory.ticksIdle++;
	// Set last idle tick
	this.memory.lastIdleTick = Game.time;
	// Go to idle point if ticks idle above threshold
	if(this.memory.ticksIdle >= Memory.idleThresholdTicks)
		this.goTo(this.room.controller);
}

// goPickup
Creep.prototype.goPickup = function(target) {
	let r = this.pickup(target);
	if(r == ERR_NOT_IN_RANGE) this.goTo(target);
	return r;
}

// goRepair
Creep.prototype.goRepair = function(structure) {
	let r = this.repair(structure);
	if (r == ERR_NOT_IN_RANGE) this.goTo(structure);
	return r;
}

// goTo
Creep.prototype.goTo = function(target, maxRooms = 1) {
	let r = this.moveTo(target,{
		visualizePathStyle: {},
		reusePath: Memory.reusePath,
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

// goWithdraw
Creep.prototype.goWithdraw = function(structure, resourceType) {
	let r = this.withdraw(structure, resourceType);
	if(r == ERR_NOT_IN_RANGE) this.goTo(structure);
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

// Switch room
Creep.prototype.switchRoom = function() {
	let roomTarget = this.memory.roomTarget;
	if(!roomTarget) return false;
	else if(roomTarget == this.room.name) {
		this.memory.roomTarget = null;
		return false;
	}
	else if(roomTarget != this.room.name) {
		// Room visible
		let room = Game.rooms[roomTarget];
		if(room) {
			this.goTo(room.controller, 16);
			return true;
		}
		// Room not visible yet
		else {
			let exit = this.pos.findClosestByPath(
				this.room.findExitTo(roomTarget)
			);
			this.goTo(exit);
			return true;
		}
	}
	else return false;
}
