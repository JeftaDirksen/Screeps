var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	let source = Game.getObjectById(creep.memory.source);
	let moveTarget = creep.memory.moveTarget;
	let movePath;
	if(creep.memory.movePath)
		movePath = Room.deserializePath(creep.memory.movePath);
	let harvest = creep.memory.harvest;
	
	// Check if empty
	if(!harvest && creep.isEmpty()) {
		harvest = creep.memory.harvest = true;
	}
	// Check if full
	if(harvest && creep.isFull()) {
		harvest = creep.memory.harvest = false;
	}

	// Check target reached
	if(moveTarget && creep.pos.inRangeTo(moveTarget, 1)) {
		moveTarget = creep.memory.moveTarget = null;
		movePath = creep.memory.movePath = null;
		f.debug('target reached');
	}
	
	// Move by path
	if(movePath) {
		let r = creep.moveByPath(movePath);
		if(r == OK) return;
		f.debug('moveByPath: '+r);
	}
	
	// Harvest
	if(creep.harvest(source) == OK) return;
	
	// Get moveTarget/movePath
	if(!moveTarget) {
		let find = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
		if(find) {
			creep.memory.source = find.id;
			moveTarget = creep.memory.moveTarget = find.pos;
			movePath = creep.pos.findPathTo(moveTarget);
			creep.memory.movePath = Room.serializePath(movePath);
		}
	}
	
	
	
	/*
	// Check if empty
	if(!creep.memory.harvest && creep.isEmpty()) {
		creep.memory.harvest = true;
	}
	// Check if full
	if(creep.memory.harvest && creep.isFull()) {
		creep.memory.harvest = false;
	}
	
	// Harvest
	if(creep.memory.harvest) {
		let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
		if(source) creep.goHarvest();
		else creep.goIdle();
	}
	// Unload
	else {
		
		// Find container/link
		let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: s => (
				s.structureType == STRUCTURE_CONTAINER
				|| s.structureType == STRUCTURE_LINK
			)
			&& (
				_.sum(s.store) < s.storeCapacity
				|| s.energy < s.energyCapacity
			)
		});
		if(container) {
			let r = creep.transfer(container, RESOURCE_ENERGY);
			if(r == ERR_NOT_IN_RANGE) creep.goTo(container);
			return;
		}
		
		// Find other (spawn/extensions/storage)
		let other = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
			filter: s => (
				s.structureType == STRUCTURE_SPAWN
				|| s.structureType == STRUCTURE_EXTENSION
				|| s.structureType == STRUCTURE_STORAGE
				) && (
					s.energy < s.energyCapacity
					|| _.sum(s.store) < s.storeCapacity
				)
		});		
		if(other) {
			let r = creep.transfer(other, RESOURCE_ENERGY);
			if(r == ERR_NOT_IN_RANGE) creep.goTo(other);
			return;
		}
		
		// Drop
		creep.drop(RESOURCE_ENERGY);
	}
	
	*/
}