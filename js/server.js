const WebSocket = require("ws");

const wss = new WebSocket.Server({ host:'www.duelquizz.rf', port:8080 });

wss.on("connection", ws=> {
    console.log("new client connected ! ");

    wss.on("close", () => {
        console.log("Client has been disconnected");
        
    });
});

