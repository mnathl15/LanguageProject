const io = require("socket.io")();
var Room = require("./src/data_storage/Room.js").Room;
const { v4:uuid4 } = require("uuid");

io.listen(3000);

var roomMap = new Map(); //This will store the data of all the current rooms we have


io.on("connection",(socket)=>{

    const native = socket.request._query.native;
    const target = socket.request._query.target;

    

    const availableRooms = findAvailableRooms(native,target);
   

    var roomId = null;
    if(availableRooms){
        console.log("This means we found some availble rooms");
        roomId = availableRooms[0];
        availableRooms[0].setUser2({name:'generic user 2'})
    }
    else{
        roomId = uuid4();
        console.log("That means this is a new room");
        const room =  new Room(roomId);
        room.setUser1({name:'generic user 1'});
        const lookingFor = {native:target,target:native} //Looking for a user with opposite native/target language
        roomMap.set(room,lookingFor);
       
    }
    joinRoom(socket,roomId);
})




//Returns rooms with desired user with sizes less than 2 people
findAvailableRooms = (native,target)=>{
    const match = {native:native,target:target}
    return ([...roomMap].find(([key,val])=>{
        return(val.native == match.native && val.target == match.target && key.numPeople < 2)
    }))
}


//Joins a specific room, and shares server made user Id's between both users!
joinRoom = (socket,roomId)=>{
    socket.join("room-"+roomId,()=>{
        const sockets=io.nsps['/'].adapter.rooms['room-'+roomId].sockets;
        for(i in sockets){
            if(i!=socket.id){
                io.sockets.to(socket.id).emit('otherId',i);
                io.sockets.to(i).emit('otherId',socket.id);
            }
            else{
                io.sockets.to(socket.id).emit('id',i); 
            }
        }
    });
}

disconnectRoom = ()=>{
    socket.close
}