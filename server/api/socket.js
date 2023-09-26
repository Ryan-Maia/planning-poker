import { Server } from "socket.io";

const io = new Server(3030, {cors: {origin: "*"}});

io.on("connection", (socket) => {
    console.log("soquete")
    
    socket.on("suaMae", (data) => {
        console.log("boquete")
    })
})

