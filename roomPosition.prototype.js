RoomPosition.prototype.hasMineral = function() {
    let mineral = this.lookFor(LOOK_MINERALS);
    if(mineral.length) {
        if(mineral[0].mineralAmount > 0) return true;
    }
    return false;
}
