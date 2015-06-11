const permaDataFile = DATA_DIR + 'permaban.json';

var fs = require('fs');

global.Permaban = {
	permaLock: {},
	permaBan: {}
};

if (!fs.existsSync(permaDataFile))
	fs.writeFileSync(permaDataFile, JSON.stringify(Permaban));

Permaban = JSON.parse(fs.readFileSync(permaDataFile).toString());

function writePermaBanData() {
	fs.writeFileSync(permaDataFile, JSON.stringify(Permaban));
}

exports.commands = {
	
	permaban: function (target, room, user) {
		if (!this.can('permaban')) return false;
		target = this.splitTarget(target);
		var userT = this.targetUser;
		if (!userT) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (userT.can('staff')) return this.sendReply("User '" + this.targetUsername + "' is an staff member. Demote before permaban.");
		if (Permaban.permaBan[userT.userid]) return this.sendReply("User '" + this.targetUsername + "' already perma banned.");
		Permaban.permaBan[userT.userid] = 1;
		userT.popup("" + user.name + " has banned you." + (target ? "\n\nReason: " + target : ""));
		userT.ban();
		this.addModCommand(this.targetUsername + " was permanently banned by " + user.name + (target ? ('. (' + target + ')') : '.'));
		writePermaBanData();
	},
	
	unpermaban: 'permaunban',
	permaunban: function (target, room, user) {
		if (!this.can('permaban')) return false;
		var userT = toId(target);
		if (!Permaban.permaBan[userT]) return this.sendReply("User '" + target + "' is not perma banned.");
		delete Permaban.permaBan[userT];
		this.addModCommand(target + " was removed from the blacklist by " + user.name);
		this.parse('/unban ' + target);
		writePermaBanData();
	},
	
	permalock: function (target, room, user) {
		if (!this.can('permaban')) return false;
		target = this.splitTarget(target);
		var userT = this.targetUser;
		if (!userT) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (userT.can('staff')) return this.sendReply("User '" + this.targetUsername + "' is an staff member. Demote before permalock.");
		if (Permaban.permaLock[userT.userid]) return this.sendReply("User '" + this.targetUsername + "' already perma locked.");
		Permaban.permaLock[userT.userid] = 1;
		userT.popup("" + user.name + " has locked you from talking in chats, battles, and PMing regular users." + (target ? "\n\nReason: " + target : ""));
		userT.lock();
		this.addModCommand(this.targetUsername + " was permanently locked by " + user.name + (target ? ('. (' + target + ')') : '.'));
		writePermaBanData();
	},
	
	unpermalock: 'permaunlock',
	permaunlock: function (target, room, user) {
		if (!this.can('permaban')) return false;
		var userT = toId(target);
		if (!Permaban.permaLock[userT]) return this.sendReply("User '" + target + "' is not perma locked.");
		delete Permaban.permaLock[userT];
		this.addModCommand(target + " was removed from the permalock list by " + user.name);
		this.parse('/unlock ' + target);
		writePermaBanData();
	},
	
	permalist: function (target, room, user) {
		if (!this.can('permaban')) return false;
		var banstr = '<b>Banned Users:<b> ' + Object.keys(Permaban.permaBan).sort().join(", ");
		var lockstr = '<b>Locked Users:</b> ' + Object.keys(Permaban.permaLock).sort().join(", ");
		this.sendReplyBox(banstr + '<br /><br />' + lockstr);
		
	},
	
	permahelp: function (target, room, user) {
		if (!this.can('permaban')) return false;
		return this.sendReplyBox(
			'<b>Permaban command list</b><br /><br />' +
			'/permaban [target] - permanently bans an user.<br />' +
			'/permaunban [target] - removes from the blacklist.<br />' +
			'/permalock [target] - permanently locks an user.<br />' +
			'/permaunlock [target] - removes from the locklist.<br />' +
			'/permalist [target] - lists all perma bans and locks.<br />'
		);
	}
	
}
