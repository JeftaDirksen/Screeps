RoomPosition.prototype.findClosestByPathInRange = function(type, range) {
	let pos = this;
	return this.findClosestByPath(type, {
		filter: function (o) {
			if (pos.getRangeTo(o) <= range) return true;
			else return false;
		}
	});
}

RoomPosition.prototype.isRoad = function() {
	let found = [];
	// Check if road
	found = this.lookFor(LOOK_STRUCTURES);
	if (found.length) {
		for (i = 0; i < found.length; i++) {
			if (found[i].structureType == STRUCTURE_ROAD) return true;
		}
	}

	// Check if constructing road
	found = this.lookFor(LOOK_CONSTRUCTION_SITES);
	if (found.length) {
		for (i = 0; i < found.length; i++) {
			if (found[i].structureType == STRUCTURE_ROAD) return true;
		}
	}

	return false;
}
