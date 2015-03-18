
exports.commands = {
	datadir: function (target) {
		if (!this.can('hotpatch')) return false;
		return this.sendReplyBox(DATA_DIR + "<br />" + LOGS_DIR);
	}
};