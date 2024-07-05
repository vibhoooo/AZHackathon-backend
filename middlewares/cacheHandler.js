const NodeCache = require("node-cache");
const cache = new NodeCache();
const cacheMiddleware = (req, res, next) => {
	req.cache = cache;
	next();
};
module.exports = cacheMiddleware;