const express = require("express");
const app = express();
const http = require('http');
const { Server } = require('socket.io')
const cors = require("cors")
app.use(cors())

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
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
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`joined room: ${data}`)
    });
  
    socket.on("send_message", (data) => {
      socket.broadcast.emit("receive_message", data);
      console.log(data)
    });

    socket.on("end_call", () => {
      socket.broadcast.emit("close_meeting");
      console.log("meeting ended")
    })
  });

  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})
  
