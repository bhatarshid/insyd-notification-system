const WebSocket = require("ws");

class WebSocketService {
  static init(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // userId -> WebSocket
    this.wss.on("connection", (ws) => {
      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message);
          switch (data.type) {
            case "auth":
              this.handleClientAuth(ws, data.userId);
              break;
            case "logout":
              this.handleClientLogout(ws, data.userId);
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

  static handleClientAuth(ws, userId) {
    this.clients.set(userId, ws);

    ws.send(
      JSON.stringify({
        type: "login_confirmed",
        message: "Login successful",
      })
    );
  }

  static handleClientLogout(ws, userId) {
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

  static handleClientDisconnected(ws) {
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

  static isUserOnline(userId) {
    return this.clients.has(userId);
  }

  static sendNotification(userIds, data) {
    userIds.forEach((userId) => {
      const userConnection = this.clients.get(userId);
      if (userConnection) {
        const messageString = JSON.stringify(data);
        if (userConnection.readyState === WebSocket.OPEN) {
          userConnection.send(messageString);
        }
      }
    })
  }

  static sendUnreadCount(userId, count) {
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
