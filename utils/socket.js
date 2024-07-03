const { Server } = require("socket.io");
let io;
module.exports = {
	init: (server) => {
		io = new Server(server, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"]
			}
		});
		io.on("connection", (socket) => {
			console.log("New client connected");
			socket.on("disconnect", () => {
				console.log("Client disconnected");
			});
			socket.on("joinLobby", (lobbyId) => {
				const lobbyRoom = `lobby-${lobbyId}`;
				socket.join(lobbyRoom);
				console.log(`Socket joined ${lobbyRoom}`);
			});
		});
		return io;
	},
	getIo: () => {
		if (!io) {
			throw new Error("Socket.io not initialized!");
		}
		return io;
	}
};
