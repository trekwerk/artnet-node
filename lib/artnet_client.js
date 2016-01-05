var dgram = require('dgram');
var Buffer = require('buffer').Buffer;

function ArtNetClient(host, port) {
	this.host = host;
	this.port = port;
	this.socket = dgram.createSocket("udp4");
	this.header = [65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14]; // 0 - 11
	this.sequence = [0]; // 12
	this.physical = [0]; // 13
	this.universe = [0, 0]; // 14 - 15
	//this.LENGTH = [0, 13]; // 16 - 17
}
exports.ArtNetClient = ArtNetClient;

exports.createClient = function(host, port) {
	return new ArtNetClient(host, port);
}

ArtNetClient.prototype.send = function(data) {
	// Calcualte the length
	var length_upper = Math.floor(data.length / 256);
	var length_lower = data.length % 256;
	
	var data = this.header.concat(this.sequence).concat(this.physical).concat(this.universe).concat([length_upper, length_lower]).concat(data);
	var buf = Buffer(data);
	this.socket.send(buf, 0, buf.length, this.port, this.host);
}

ArtNetClient.prototype.close = function(){
	this.socket.close();
};
