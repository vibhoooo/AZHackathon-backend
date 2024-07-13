const express = require("express");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const app = express();
app.use(express.urlencoded({ extended: false }));
// const http = require("http"); // 1
// const server = http.createServer(app); // 2
// const { init } = require("./utils/socket"); // 3
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");
const pusher = require('./pusherConfig');
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
// const io = init(server); // 4
// app.post('/pusher/user-auth', (req, res) => {
// 	const socketId = req.body.socket_id;
// 	const user = { id: "user_id" };
// 	const authResponse = pusher.authorizeChannel(socketId, user);
// 	res.send(authResponse);
// });
app.post('/pusher/user-auth', (req, res) => {
	const socketId = req.body.socket_id;
	const channel = req.body.channel_name;
	const email = req.body.email;
	const presenceData = {
		user_id: email,
		user_info: {
			email: email,
		},
	};
	const auth = pusher.authorizeChannel(socketId, channel, presenceData);
	res.send(auth);
});
app.listen(port, () => {
	console.log(`Server running on port ${port} and cluster ${process.pid}`);
});
