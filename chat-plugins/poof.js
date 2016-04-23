const messages = [
    "ha utilizado Explosión!",
    "fue tragado por la tierra!",
    "ha dejado el edificio.",
    "se perdió en el bosque!",
    "fue dejado por su amante!",
    "fue absorbido por un remolino!",
    "se asustó y salió del servidor!",
    "entró en una cueva sin repelente!",
    "consiguió ser comido por un grupo de pirañas!",
    "se ha aventurado demasiado profundo en el bosque sin una cuerda de escape",
    "despertó un Snorlax enojado!",
    "se utilizó como cebo para pescar un tiburón!",
    "recibió el juicio del Todopoderoso Arceus!",
    "entró en la hierba sin ningún Pokemon!",
    "se perdió en la ilusión de la realidad.",
    "se comió una bomba!",
    "fue dejado en visto y exploto!",
    "cayó en un nido de víboras!",
];

exports.commands = {
	d: 'poof',
	cpoof: 'poof',
	poof: function (target, room, user) {
		if (Config.poofOff) return this.sendReply("Poof is currently disabled.");
		if (target && !this.can('broadcast')) return false;
		if (room.id !== 'lobby') return false;
		var message = target || messages[Math.floor(Math.random() * messages.length)];
		if (message.indexOf('{{user}}') < 0) {
			message = '{{user}} ' + message;
		}
		message = message.replace(/{{user}}/g, user.name);
		if (!this.canTalk(message)) return false;

		var colour = '#' + [1, 1, 1].map(function () {
			var part = Math.floor(Math.random() * 0xaa);
			return (part < 0x10 ? '0' : '') + part.toString(16);
		}).join('');

		room.addRaw('<center><strong><font color="' + colour + '">~~ ' + Tools.escapeHTML(message) + ' ~~</font></strong></center>');
		user.disconnectAll();
	},

	poofoff: 'nopoof',
	nopoof: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = true;
		return this.sendReply("Poof is now disabled.");
	},

	poofon: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = false;
		return this.sendReply("Poof is now enabled.");
	}
};