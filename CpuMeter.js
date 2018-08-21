const c = require('config');
const f = require('functions');

module.exports = class CpuMeter {
	
	constructor(meterName) {
		this.name = meterName;
		if(!Memory.CpuMeter) Memory.CpuMeter = {};
		if(!Memory.CpuMeter[this.name]) Memory.CpuMeter[this.name] = {};
		if(!Memory.CpuMeter[this.name].values)
			Memory.CpuMeter[this.name].values = [];
	}
	
	start() {
		this.startCpuUsed = Game.cpu.getUsed();
	}
	
	stop() {
		this.stopCpuUsed = Game.cpu.getUsed();
		let cpuUsed = this.stopCpuUsed - this.startCpuUsed;
		let values = Memory.CpuMeter[this.name].values;
		values.push(cpuUsed);
		if(values.length>10) values = values.slice(values.length-10);
		Memory.CpuMeter[this.name].values = values;
	}
	
	getAverage(decimals = 2) {
		let values = Memory.CpuMeter[this.name].values;
		let sum = 0;
		for(let i = 0; i < values.length; i++) {
			sum += values[i];
		}
		let average = sum / values.length;
		return Math.round(average*Math.pow(10,decimals))/Math.pow(10,decimals);
	}
	
};
