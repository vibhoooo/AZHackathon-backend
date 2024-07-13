const { Server } = require("socket.io");
const lobbyOwnerSockets = {};
let io;
module.exports = {
	init: (server) => {
		io = new Server(server, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
			},
		});
		io.on("connection", (socket) => {
			console.log("New client connected", socket.id);
			socket.on("joinLobbyOwner", (data) => {
				const { lobbyId, ownerEmail } = data;
				console.log(`Lobby owner ${ownerEmail} joined lobby ${lobbyId}`);
				lobbyOwnerSockets[lobbyId] = socket.id;
				console.log(lobbyOwnerSockets);
				socket.join(`lobby-${lobbyId}`);
			});
			socket.on("joinRequest", (data) => {
				const { lobbyId, participant } = data;
				console.log(`Join request received for lobby ${lobbyId} from ${participant}`);
				const ownerSocketId = lobbyOwnerSockets[lobbyId];
				if (ownerSocketId) {
					io.to(ownerSocketId).emit("joinRequestNot", { lobbyId: lobbyId, participant });
				} else {
					console.log(`No owner found for lobby ${lobbyId}`);
				}
			});
			socket.on("disconnect", () => {
				console.log("Client disconnected", socket.id);
				Object.keys(lobbyOwnerSockets).forEach((lobbyId) => {
					if (lobbyOwnerSockets[lobbyId] === socket.id) {
						delete lobbyOwnerSockets[lobbyId];
						console.log(`Removed socket ${socket.id} from lobby ${lobbyId}`);
					}
				});
			});
		});
		return io;
	},
	getIo: () => {
		if (!io) {
			throw new Error("Socket.io not initialized!");
		}
		return io;
	},
	io,
	lobbyOwnerSockets,
};