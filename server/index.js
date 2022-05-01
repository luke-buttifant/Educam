const express = require("express");
const app = express();
const http = require('http');
const { Server, Socket } = require('socket.io')
const {userJoin, getRoomUsers, getActiveRooms} = require('./utils/users')
const cors = require("cors")
app.use(cors())

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
})

const {v4: uuidV4} = require('uuid')

const dotenv = require('dotenv').config();
const connectDB = require('./database/db')
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const PORT = process.env.PORT || 3001;


//Database Connection
connectDB()


app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

//User Routes
app.use('/api/users', require('./routes/UserRoutes'))

app.use('/api/classroom', require('./routes/classroomRoutes'))

app.use(notFound)
app.use(errorHandler)


app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

  io.on("connection", (socket) => {
    socket.broadcast.emit("user_connected");
    console.log(`User Connected: ${socket.id}`);


    socket.on("disconnect", () => {
      socket.broadcast.emit("user_disconnected")
    })


    socket.on("raise_hand", (data) => {
      socket.to(data.room).emit("student_raised_hand", data)
    })


    socket.on("teacher_joined", (data) => {
      socket.to(data).emit("teacher_joined_room", data)
    })

    socket.on("ignore_request", (data) => {
      socket.to(data).emit("teacher_ignored_request", data)
    })

    socket.on("join_room", (data) => {
      const users = userJoin(data);
      // console.log(users)
      socket.join(data.room);
      socket.to(data.room).emit("user_joined_room", users);
    });

    socket.on("leave_room", (data) => {
      socket.to(data).emit("user_left");
      console.log(`${data.id}: left the room`)
    })

    socket.on("send_statistics", (data) => {
      socket.to(data.room).emit("user_sent_stats", {email: data.email, hours: data.hours, minutes: data.minutes, seconds: data.seconds, event_id: data.event_id});
    })
  
    socket.on("send_meeting_stats", (data) => {
      socket.to(data.room).emit("user_sent_stats", {email: data.email, hours: data.hours, minutes: data.minutes, seconds: data.seconds, event_id: data.event_id});
    })

    socket.on("teacher_check_approved", (data) => {
      socket.to(data).emit("teacher_is_in_room", data)
    })

    socket.on("update_connections", (data) => {
      console.log("update connections recieved room: " + data)
      socket.to(data).emit("update_user_connections", data)
    })

    socket.on("update_counter", (data) => {
      socket.to(data).emit("update_user_counter")
    })

    socket.on("student_is_attending", (data) => {
      socket.to(data.room).emit("student_confirmed_attendance", data)
    })
    
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
      console.log(data.room)
    });

    socket.on("end_call", (data) => {
      socket.to(data.room).emit("close_meeting");
      console.log("meeting ended")
    })

    socket.on("ar_coordinates", (data) => {
      console.log(data)
      socket.to(data.room).emit("ar_coordinates_recieved", data)
    })

    socket.on("turn_off_ar", (data) => {
      socket.to(data).emit("ar_turned_off")
    })

    

    socket.on("get_users", (room) => {
      console.log("get users room: " + room)
      const roomUsers = getActiveRooms(io)
      for(let i = 0; i < roomUsers.length; i++){
        if(roomUsers[i].room === room){
          socket.emit("user_count", roomUsers[i])
        }
      }
      
    })
  });

  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})
  
