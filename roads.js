var c = require('config');
var f = require('functions');

module.exports = {
	build: function () {
		// Remove old pathUse records
		removeOld(c.pathUseRemoveAge);

		// Stop if max contructions sites reached
		if (_.size(Game.constructionSites) >= c.maxConstructionSites)
			return;

		// Build roads
		let mostUsed = pullMostUsed(c.pathUseMinimumTimesUsed);
		if (!mostUsed) return;
		let result = mostUsed.createConstructionSite(STRUCTURE_ROAD);
		if (result != OK) f.error('Road creation failed');
	},

	registerPath: function (position) {
		// Check if already road or road constructionSite
		if (position.isRoad()) {
			// Remove pos from Memory
			let index = findPosPathUse(position);
			if (index !== false) {
				Memory.pathUse.splice(index, 1);
			}
			return;
		}

		// Check if pos already registered
		let index = findPosPathUse(position);
		if (index !== false) {
			// Already registered - Update record
			Memory.pathUse[index].timesUsed++;
			Memory.pathUse[index].lastUsed = Game.time;
		}
		else {
			// New register
			let newIndex = Memory.pathUse.push(position) - 1;
			Memory.pathUse[newIndex].timesUsed = 1;
			Memory.pathUse[newIndex].lastUsed = Game.time;
		}
	},

};

function pullMostUsed (minTimesUsed = 1) {
	let highestTimesUsed = minTimesUsed - 1;
	let index = false;
	for (i = 0; i < Memory.pathUse.length; i++) {
		if (Memory.pathUse[i].timesUsed > highestTimesUsed) {
			index = i;
			highestTimesUsed = Memory.pathUse[i].timesUsed;
		}
	}
	if (index === false) return false;
	let pathUse = Memory.pathUse.splice(index, 1)[0];
	let age = Game.time - pathUse.lastUsed;
	f.debug('Building road: room:'+pathUse.roomName+' x:'+pathUse.x+' y:'+pathUse.y+' timesUsed:'+pathUse.timesUsed+' lastUsedAgo:'+age);
	let pos = new RoomPosition(pathUse.x, pathUse.y, pathUse.roomName);
	return pos;
}

function removeOld (age) {
	for (i = 0; i < Memory.pathUse.length; i++) {
		if (Memory.pathUse[i].lastUsed <= Game.time - age) {
			Memory.pathUse.splice(i, 1);
		}
	}
}

function findPosPathUse(position) {
	for (i = 0; i < Memory.pathUse.length; i++) {
		if (position.roomName != Memory.pathUse[i].roomName) continue;
		if (position.x != Memory.pathUse[i].x) continue;
		if (position.y != Memory.pathUse[i].y) continue;
		return i;
	}
	return false;
}
