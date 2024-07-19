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
	socket.on("joinLobby", (data) => {
		const { lobbyId, participant } = data;
		console.log(`New participant ${participant} joined lobby ${lobbyId}`);
		socket.join(`lobby-${lobbyId}`);
	}); 
	socket.on("gameStarted", (data) => {
		const { lobbyId, mcq } = data;
		console.log("Game started");
		socket.to(`lobby-${lobbyId}`).emit("firstMcq", { mcq });
	});
	socket.on("submissionReceived", (data) => {
		const { newScore, nextMcq } = data;
		console.log("Submission received");
		socket.emit("newScoreAndMcq", { newScore, nextMcq });
	});
	socket.on("gameFinished", (data) => {
		const { lobbyId, winnerName, winnerScore } = data;
		console.log("Game finsihed");
		socket.to(`lobby-${lobbyId}`).emit("gameFinished", { winnerName, winnerScore });
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