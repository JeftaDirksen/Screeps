RoomPosition.prototype.findClosestByPathInRange = function(type, range) {
	let pos = this;
	return this.findClosestByPath(type, {
		filter: function (o) {
			if (pos.getRangeTo(o) <= range) return true;
			else return false;
		}
	});
}
