const express = require("express");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});
io.on("connection", (socket) => {
	// socket.on("joinLobbyOwner", (data) => {
	// 	const { lobbyId, ownerEmail } = data;
	// 	console.log(`Lobby owner ${ownerEmail} created lobby ${lobbyId}`);
	// 	socket.join(`lobby-${lobbyId}`);
	// });
	// socket.on("joinRequest", (data) => {
	// 	const { lobbyId, participant } = data;
	// 	console.log(`New participant ${participant} joined lobby ${lobbyId}`);
	// 	socket.join(`lobby-${lobbyId}`);
	// 	socket.to(`lobby-${lobbyId}`).emit("joinRequest-not", data);
	// });
	// socket.on("sendPrivateMessage", (data) => {
	// 	const { lobbyId, targetEmail } = data;
	// 	console.log(`Submission received by participant ${targetEmail} of lobby ${lobbyId}`);
	// 	socket.emit("privateMessage", { lobbyId, targetEmail });
	// });
	// socket.on("refresh", (data) => {
	// 	const { lobbyId, ownerEmail } = data;
	// 	socket.join(`lobby-${lobbyId}`);
	// });
	socket.on("joinLobby", (data) => {
		const { lobbyId, participant } = data;
		console.log(`New participant ${participant} joined lobby ${lobbyId}`);
		socket.join(`lobby-${lobbyId}`);
	}); 
	// socket.on("gameStarted", (data) => {
	// 	const { game, mcq, startTime } = data;
	// 	console.log("Game started");
	// 	socket.to(`lobby-${lobbyId}`).emit("firstMcq", { game, mcq, startTime });
	// });
	socket.on("gameStarted", (data) => {
		const { lobbyId, message, mcq } = data;
		console.log("Game started");
		socket.to(`lobby-${lobbyId}`).emit("firstMcq", { message, mcq });
	});
});
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");
connectDB();
const errorHandler = require("./middlewares/errorHandler");
const cacheMiddleware = require("./middlewares/cacheHandler");
const morgan = require("morgan");
const port = process.env.PORT;
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cacheMiddleware);
app.use("/users", require("./routes/userRoutes"));
app.use("/mcqs", require("./routes/mcqRoutes"));
app.use("/lobbies", require("./routes/lobbyRoutes"));
app.use("/games", require("./routes/gameRoutes"));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(errorHandler);
server.listen(port, () => {
	console.log(`Server running on port ${port} and cluster ${process.pid}`);
});
module.exports = { io };