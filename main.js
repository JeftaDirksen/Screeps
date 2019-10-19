module.exports.loop = function () {

	// CPU Bucket check
	if(Game.cpu.bucket < 100) {
		f.warning('Skipping tick due to low CPU bucket');
		return;
	}
	
	// Clear memory
	for (let name in Memory.creeps) {
		if (Game.creeps[name]) continue;
		console.log('Creep died ' + name + ' (' + Memory.creeps[name].room + ')');
		delete Memory.creeps[name];
	}
   
}
