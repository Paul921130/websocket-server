// import library
const express = require("express");
const ServerSocket = require("ws").Server; // 引用 Server

const PORT = 8080;

// 建立 express 物件並用來監聽 8080 port
const server = express().listen(PORT, () =>
  console.log(`[Server] Listening on https://localhost:${PORT}`)
);

// 建立實體，透過 ServerSocket 開啟 WebSocket 的服務
const wss = new ServerSocket({ server });

// Connection opened
wss.on("connection", (ws, req) => {
  ws.id = req.headers["sec-websocket-key"].substring(0, 8);
  ws.send(`[Client ${ws.id} is connected!]`);

  // Listen for messages from client
  ws.on("message", (data) => {
    console.log("[Message from client] data: ", data);
    // Get clients who has connected
    let clients = wss.clients;
    // Use loop for sending messages to each client
    clients.forEach((client) => {
      client.send(`${ws.id}: ` + data);
    });
  });

  // Connection closed
  ws.on("close", () => {
    console.log("[Close connected]");
  });
});
