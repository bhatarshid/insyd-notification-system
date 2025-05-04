const WebSocket = require("ws");

class WebSocketService {
  constructor(server) {
    this.clients = new Map(); // userId -> WebSocket
    this.wss = new WebSocket.Server({ server });
    this.init();
  }

  init() {
    this.wss.on("connection", (ws) => {
      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message);
          switch (data.type) {
            case "auth":
              this.handleClientAuth(ws, data.userId);
              break;
            case "logout":
              await this.handleClientLogout(ws, data.userId);
              break;
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      });
      ws.on("close", () => {
        this.handleClientDisconnected(ws);
      });
    });
  }

  async handleClientAuth(ws, userId) {
    ws.userId = userId;

    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }

    this.clients.get(userId)?.add(ws);

    ws.send(
      JSON.stringify({
        type: "login_confirmed",
        message: "Login successful",
      })
    );
  }

  async handleClientLogout(ws, userId) {
    try {
      const userConnections = this.clients.get(userId);
      if (userConnections) {
        userConnections.delete(ws);

        // If no more connections, remove user entry
        if (userConnections.size === 0) {
          this.clients.delete(userId);
        }
      }

      ws.send(
        JSON.stringify({
          type: "logout_confirmed",
          message: "Logout successful",
        })
      );

      ws.close(1000, "Logout successful");
    } catch (error) {
      ws.close(1011, "Error during logout");
    }
  }

  handleClientDisconnected(ws) {
    if (ws.userId) {
      const userConnections = this.clients.get(ws.userId);
      if (userConnections) {
        userConnections.delete(ws);

        if (userConnections.size === 0) {
          this.clients.delete(ws.userId);
        }
      }
    }
  }

  isUserOnline(userId) {
    return this.clients.has(userId);
  }

  sendNotification(userId, notification) {
    const userConnections = this.clients.get(userId);
    if (userConnections) {
      userConnections.forEach((ws) => {
        ws.send(
          JSON.stringify({
            type: "NEW_NOTIFICATION",
            data: notification,
          })
        );
      });
    }
  }

  sendUnreadCount(userId, count) {
    const userConnections = this.clients.get(userId);
    if (userConnections) {
      userConnections.forEach((ws) => {
        ws.send(
          JSON.stringify({
            type: "UNREAD_COUNT_UPDATE",
            data: { count },
          })
        );
      });
    }
  }
}

module.exports = WebSocketService;
