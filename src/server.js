const http = require("http");
const app = require("./app");
const WebSocketService = require("./services/web-socket-service");
const db = require("./db/database");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

WebSocketService.init(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});