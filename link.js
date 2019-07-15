var f = require('functions');

module.exports = function () {
    // Memory setup
	if(!Memory.links) Memory.links = {};
    
	// For every room
	for (let roomName in Game.rooms) {
		let room = Game.rooms[roomName];

		// Check links for undefined type
		let links = room.find(FIND_MY_STRUCTURES, {
			filter: s =>
			    s.structureType == STRUCTURE_LINK
			    && (!Memory.links[s.id] || !Memory.links[s.id].type)
		});
		for(let i in links) {
		    let link = links[i];
		    if(!Memory.links[link.id]) Memory.links[link.id] = {};
		    Memory.links[link.id].type = 'sender';
		}

		// Senders with energy and no cooldown
		let senders = room.find(FIND_MY_STRUCTURES, {
			filter: s =>
			    s.structureType == STRUCTURE_LINK
			    && (Memory.links[s.id].type == 'sender')
			    && s.energy > 0
			    && s.cooldown == 0
		});
		
		// Receivers not full
		let receivers = room.find(FIND_MY_STRUCTURES, {
			filter: s =>
			    s.structureType == STRUCTURE_LINK
			    && (Memory.links[s.id].type == 'receiver')
			    && s.energy < s.energyCapacity
		});

        // Transfer from highestSender to lowestReceiver
        if(senders.length && receivers.length) {
            // Highest sender
            senders = _.sortByOrder(senders, 'energy', 'desc');
            let highestSender = senders[0];

    		// Lowest receiver
    		receivers = _.sortBy(receivers, 'energy');
    		let lowestReceiver = receivers[0];

            highestSender.transferEnergy(lowestReceiver);
        }
	}
}
