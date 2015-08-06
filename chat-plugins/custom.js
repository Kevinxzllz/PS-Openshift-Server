
exports.commands = {
	/*stafflist: 'authlist',
	authlist: function (target, room, user, connection) {
		var rankLists = {};
		for (var u in Users.usergroups) {
			var rank = Users.usergroups[u][0];
			var name = Users.usergroups[u].slice(1);
			if (!rankLists[rank]) rankLists[rank] = [];
			if (name) name = name.replace("\n", "").replace("\r", "");
			rankLists[rank].push(name);
		}
		var buffer = [];
		Object.keys(rankLists).sort(function (a, b) {
			return Config.groups[b].rank - Config.groups[a].rank;
		}).forEach(function (r) {
			buffer.push(Config.groups[r].name + "s (" + r + "):\n" + rankLists[r].sort().join(", "));
		});

		if (!buffer.length) {
			buffer = "This server has no auth.";
			return connection.popup("This server has no auth.");
		}
		connection.popup(buffer.join("\n\n"));
	},*/
	
	postimage: 'image',
	image: function (target, room, user) {
		if (!target) return this.sendReply('Usage: /image link, size');
		if (!this.can('ban', room)) return false;
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		if (targets.length !== 2) {
			return this.sendReply('|raw|<center><img src="' + Tools.escapeHTML(targets[0]) + '" alt="" width="50%"/></center>');
		}
		if (parseInt(targets[1]) <= 0 || parseInt(targets[1]) > 100) return this.parse('Usage: /image link, size (1-100)');
		this.sendReply('|raw|<center><img src="' + Tools.escapeHTML(targets[0]) + '" alt="" width="' + toId(targets[1]) + '%"/></center>');
	},
	
	cssedit: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {return this.sendReply("/cssedit - Access denied.");}
		var fsscript = require('fs');
		if (!target) {
			if (!fsscript.existsSync(DATA_DIR + "custom.css")) return this.sendReply("custom.css no existe.");
			return this.sendReplyBox(fsscript.readFileSync(DATA_DIR + "custom.css").toString());
		}
		fsscript.writeFileSync(DATA_DIR + "custom.css", target.toString());
		this.sendReply("custom.css editado correctamente.");
	},
	
	destroymodlog: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {return this.sendReply("/destroymodlog - Access denied.");}
		var fsscript = require('fs');
		var logPath = LOGS_DIR + 'modlog/';
		if (CommandParser.modlog && CommandParser.modlog[room.id])  {
			CommandParser.modlog[room.id].close();
			delete CommandParser.modlog[room.id];
		}
		try {
			fsscript.unlinkSync(logPath + "modlog_" + room.id + ".txt");
			this.addModCommand(user.name + " ha destruido el modlog de esta sala." + (target ? ('(' + target + ')') : ''));
		} catch (e) {
			this.sendReply("No se puede destruir el modlog de esta sala.");
		}
	},

	clearall: function (target, room, user, connection) {
		if (!this.can('clearall')) return;
		var len = room.log.length,
			users = [];
		while (len--) {
			room.log[len] = '';
		}
		for (var user in room.users) {
			users.push(user);
			Users.get(user).leaveRoom(room, Users.get(user).connections[0]);
		}
		len = users.length;
		setTimeout(function() {
			while (len--) {
				Users.get(users[len]).joinRoom(room, Users.get(users[len]).connections[0]);
			}
		}, 1000);
	},

	roomlist: function (target, room, user) {
		if (!this.can('roomlist')) return;
		var rooms = Object.keys(Rooms.rooms);
		var len = rooms.length;
		var official = ['<b><font color="#1a5e00" size="2">Salas oficiales:</font></b><br><br>'];
		var nonOfficial = ['<hr><b><font color="#000b5e" size="2">Salas no-oficiales:</font></b><br><br>'];
		var privateRoom = ['<hr><b><font color="#5e0019" size="2">Salas privadas:</font></b><br><br>'];
		while (len--) {
			var _room = Rooms.rooms[rooms[(rooms.length - len) - 1]];
			if (_room.type === 'chat') {
				if (_room.isOfficial) {
					official.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a> |'));
				} else if (_room.isPrivate) {
					privateRoom.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a> |'));
				} else {
					nonOfficial.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a> |'));
				}
			}
		}
		this.sendReplyBox(official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' '));
	}
};