var c = require('config');
var f = require('functions');

module.exports = {
	
	build(spawn) {
		if (spawn.spawning) return;
		
	},
	
}

function generateName(type) {
	let t = type.charAt(0).toUpperCase();
	for(let i = 1; i<=100; i++) {
		let name = t+i;
		if(!Game.creeps[name]) {
			return name;
		}
	}
	f.error('Name generation failed ('+type+')');
}
