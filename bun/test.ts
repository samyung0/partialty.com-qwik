Bun.serve({
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      // show message from the client
      console.log("Message received: " + message);
      // send a message after 4 seconds
      setTimeout(() => ws.send("saved!"), 4000);
    },
    open(ws) {
      // show message if a client connected
      console.log("Client connected");
    },
  },
  port: 4010,
});
