var f = require('functions');
var jq = require('jobQueue');

Creep.prototype.run = function() {

    // Check job / Get job
    if (!this.memory.job) {
        let job = jq.getJob(this.memory.type);
        if (job) {
            jq.assignJob(job, this);
        }
    }


}