const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { init } = require("./utils/socket");
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");
connectDB();
const errorHandler = require("./middlewares/errorHandler");
const port = process.env.PORT;
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/users", require("./routes/userRoutes"));
app.use("/mcqs", require("./routes/mcqRoutes"));
app.use("/lobbies", require("./routes/lobbyRoutes"));
app.use("/games", require("./routes/gameRoutes"));
app.use(errorHandler);
const io = init(server);
io.on("connection", (socket) => {
	console.log("New client connected");
	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});
server.listen(port, () => {
	console.log(`Server running on port ${port} and cluster ${process.pid}`);
});
