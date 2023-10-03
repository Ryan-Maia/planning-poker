import { Server } from "socket.io";

const io = new Server(3030, { cors: { origin: "*" } });
const rooms = [];
const roomsIds = [];

const room = {
  id: 'id da sala',
  title: 'titulo da sala',
  owner: 'socket do dono da sala',
  users: [],
  options: ['1', '2', '3', '4'],
  allowChangingVote: false,
  autoRevealVotes: false,
  realTimeSpectate: false,
  issues: [],
  lastUserId: 0
}

const user = {
  id: 'id do usuario',
  name: 'nome do usuario',
  vote: 'voto do usuario',
  socket: 'socket do usuario',
  room: 'id da sala do usuario',
  cookie: 'cookie do usuario',
}

const issue = {
  id: 'id da issue',
  name: 'nome da issue',
  result: {},
}

function generateRoomId() {
  const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let resultado = '';
  for (let i = 0; i < 4; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres.charAt(indiceAleatorio);
  }
  return resultado;
}

io.on("connection", (socket) => {
  console.log("Nova Conexão")

  socket.on("createRoom", (data) => {
    const { user, room } = data;

    // Início da Geração do código da sala
    let roomId = ""

    while(true) {
      room.id = generateRoomId()
      if (!rooms.includes(room.id)) break
      console.error(`Sala com id: ${room.id} já existente, gerando outro...`)
    }

    
    roomsIds.push(room.id)
    // Fim da Geração do código da sala

    room.lastUserId = 1;
    room.users = [];
    room.issues = [];
    room.owner = { id: room.lastUserId, name: user, vote: '?', socket: socket };
    room.users.push({ id: room.lastUserId, name: user, vote: '?', socket: socket, room: roomId, voted: false });
    rooms.push(room);
    socket.emit("roomCreated", { roomId: room.id });
  }),

  socket.on("joinRoomAsSpectator", (data) => {
    //TO DO
  })

  socket.on("joinRoom", (data) => {
    console.log('🚀 ~ file: socket.js:55 ~ data:', data);
    const room = rooms.find(room => room.id == data.roomId);
    if (!room) {
      socket.emit('invalidRoom');
      return;
    }
    
    if (data.cookie) {
      const cookie = data.cookie.split('|');
      if (cookie[1] == room.id) {
        console.log('id de alguma coisa', cookie[0])
        console.log('socket', cookie[2])
        console.log('roms', room.users)
        const user = room.users.find(user => user.id == cookie[0] && user.socket.id == cookie[2]);
        const wasOwner = room.owner.id == cookie[0] && room.owner.socket.id == cookie[2];
        if (user) {
          user.socket = socket;
          socket.join(room.id);
          socket.emit("userInfo", { owner: wasOwner, cookie: `${user.id}|${room.id}|${socket.id}` });
          io.to(room.id).emit("roomData", roomWithoutUsersSocket(room));
          return;
        } else {
          console.log('socket invalido');
          socket.emit("invalidCookie");
        }
      }
    } else {
      if (socket === room.owner.socket) {
        socket.join(room.id);
        socket.emit("userInfo", { owner: true, cookie: `1|${room.id}|${socket.id}` });
      } else {
        const { user, roomId } = data;
        socket.join(room.id);
        io.to(roomId).emit("message", "Um novo usuario entrou na sala", user);
        room.lastUserId++;
        room.users.push({ id: room.lastUserId, name: user, vote: '?', socket: socket, room: roomId, voted: false });
        socket.emit("userInfo", { owner: false, cookie: `${room.lastUserId}|${room.id}|${socket.id}` });
      }
      io.to(room.id).emit("roomData", roomWithoutUsersSocket(room));
    }
  }),

  socket.on("vote", (data) => {
    const room = rooms.find(room => room.id == data.roomId)
    const user = room.users.find(user => user.socket === socket);
    user.vote = data.value;
    io.to(data.roomId).emit("userVoted", { vote: data.value, userId: user.id});
  })

  socket.on("revealVotes", (data) => {
    io.to(data.roomId).emit("reveal", "Votos revelados", data.room.users.map(user => { return { name: user.name, vote: user.vote } }));
  })

  socket.on("leaveRoom", (data) => {
    const { roomId, user } = data;
    socket.leave(roomId);
    io.to(roomId).emit("message", "Um usuario saiu da sala", user);
    rooms.find(room => room.id == roomId).users = rooms.find(room => room.id == roomId).users.filter(user => user.name !== data.user);
    io.to(roomId).emit("updateUsers", rooms.find(room => room.id == roomId).users);
  })

  function roomWithoutUsersSocket(room) {
    return {
      id: room.id,
      title: room.title,
      owner: room.owner.name,
      users: room.users.map(user => {
        return { id: user.id, name: user.name, vote: user.vote, room: user.room }
      }),
      options: room.options,
      allowChangingVote: room.allowChangingVote,
      autoRevealVotes: room.autoRevealVotes,
      realTimeSpectate: room.realTimeSpectate,
      issues: room.issues
    }
  }

  // socket.on("disconnect", () => {
  // 	console.log("disconectado")
  // 	io.to(roomId).emit("message", "Um usuario saiu da sala", user);
  // 	rooms.find(room => room.id == roomId).users = rooms.find(room => room.id == roomId).users.filter(user => user.name !== data.user);
  // 	io.to(roomId).emit("updateUsers", rooms.find(room => room.id == roomId).users);
  // })

})



