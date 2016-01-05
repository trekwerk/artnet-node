var util = require('util');
var events = require('events');
var dgram = require('dgram');

// ArtNet server class
exports.listen = function(port, cb) {
	this.port = port;
	events.EventEmitter.call(this);
	
	// Set up the socket
	var sock = dgram.createSocket("udp4", function (msg, peer) {
		
		if (msg.length < 18) return;

		var opcode = msg.readUInt16LE(8);
		if (opcode != 0x5000) return;
		
		var version = msg.readUInt16BE(10); 
		var sequence = msg.readUInt8(12);	
		var physical = msg.readUInt8(13);
		var universe = msg.readUInt16LE(14);
		var length = msg.readUInt16BE(16);
		var dmx = [];	
		for (var i = 18; i < 18 + length; i++) {
			dmx.push(msg.readUInt8(i));
		}
		
		// create artnet object
		var artnet = {
			version: version,
			sequence: sequence,
		 	physical: physical,
		 	universe: universe,
		 	length: length,
		 	data: dmx
		 };
		
		// And call the callback passing the deseralized data
		cb(artnet, peer);
	});
	sock.bind(port);
}

// Setup EventEmitter for the ArtNetServer
util.inherits(this, events.EventEmitter);

