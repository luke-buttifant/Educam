const express = require("express");
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
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

app.use(notFound)
app.use(errorHandler)


app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})
  
