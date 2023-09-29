import { Server } from "socket.io";

const io = new Server(3030, {cors: {origin: "*"}});
const rooms = [];
let roomId = 0;

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

io.on("connection", (socket) => {
	console.log("soquete")

	socket.on("createRoom", (data) => {
		const {user, room} = data;
		roomId++;
		room.id = roomId;
		room.lastUserId = 1;
		room.users = [];
		room.owner = {id: room.lastUserId, name: user, vote: '?', socket: socket};
		room.users.push({id: room.lastUserId, name: user, vote: '?', socket: socket, room: roomId});
		rooms.push(room);
		socket.emit("roomCreated", {roomId: roomId});
	}),

	socket.on("joinRoomAsSpectator", (data) => {
		//TO DO
	})
	
	socket.on("joinRoom", (data) => {
		const room = rooms.find(room => room.id == data.roomId);
		if(!room) {
			socket.emit('invalidRoom');
			return;
		}
		if(data.cookie) {
			const cookie = data.cookie.split('|');
			if(cookie[1] == room.id) {
				const user = room.users.find(user => user.id == cookie[0] && user.socket.id == cookie[2]);
				const wasOwner = room.owner.id == cookie[0] && room.owner.socket.id == cookie[2];
				if(user) {
					user.socket = socket;
					socket.join(room.id);
					socket.emit("userInfo", {owner: wasOwner, cookie: `${user.id}|${room.id}|${socket.id}`});
					io.to(room.id).emit("roomData", roomWithoutUsersSocket(room));
					return;
				} else {
					console.log('socket invalido');
					socket.emit("invalidCookie");
				}
			}
		} else {
			if(socket === room.owner.socket){
				socket.join(room.id);
				socket.emit("userInfo", {owner: true, cookie: `1|${room.id}|${socket.id}`});
			} else {
				const {user, roomId} = data;
				socket.join(room.id);
				io.to(roomId).emit("message", "Um novo usuario entrou na sala", user);
				room.lastUserId++;
				room.users.push({name: user, vote: '?', socket: socket, room: roomId});
				socket.emit("userInfo", {owner: false, cookie: `${room.lastUserId}|${room.id}|${socket.id}`});
			}
			io.to(room.id).emit("roomData", roomWithoutUsersSocket(room));
		}
	}),
	

	socket.on("vote", (data) => {
		const user = rooms.find(room => room.id == data.roomId).users.find(user => user.socket === socket);
		user.vote = data.value;
		io.to(data.roomId).emit("userVoted", `O usuario ${data.user} votou`, {user: user.name, vote: data});
	})

	socket.on("revealVotes", (data) => {
		io.to(data.roomId).emit("reveal", "Votos revelados", data.room.users.map(user => {return {name: user.name, vote: user.vote}}));
	})

	socket.on("leaveRoom", (data) => {
		const {roomId, user} = data;
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
				return {id: user.id, name: user.name, vote: user.vote, room: user.room}
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



