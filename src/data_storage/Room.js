class Room{
    
    constructor(roomId){
        this.roomId = roomId;
        this.numPeople = 0;
    }

    setUser1 = (data)=>{
        this.user1 =data;
        this.numPeople++; 

    }

    setUser2 = (data)=>{
        this.user2 = data;
        this.numPeople++;
    }
}
module.exports = {Room};