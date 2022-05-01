var users = [];

function userJoin(room, name, username){
    const user = {room, name, username};
    users.push(user)
    return users;
}


function getRoomUsers(room){
    console.log(users)
    return users.filter(user => user.room === room) 
}

function getActiveRooms(io) {
    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arr = Array.from(io.sockets.adapter.rooms);
    // Filter rooms whose name exist in set:
    // ==> [['room1', Set(2)], ['room2', Set(2)]]
    const filtered = arr.filter(room => !room[1].has(room[0]))
    // Return only the room name: 
    // ==> ['room1', 'room2']
    var activeRooms = []
    filtered.map(rooms => activeRooms.push({room: rooms[0], size: rooms[1].size}))
    // const res = filtered.map(i => i[0]);
    return activeRooms;
}


module.exports = {userJoin, getRoomUsers, getActiveRooms}