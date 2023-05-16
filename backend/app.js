require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
// const WebSocket = require('ws');
// const wsServer = new WebSocket.Server({port: 9010});
const fs = require('fs');
const https = require('https');
const multer = require('multer');
const { Server } = require('socket.io');
const {storageConfig, fileFilter} = require('./services/multer/multerConfig');
const app = express();
const PORT = process.env.PORT||3000;

// app.use(express.static(__dirname + "\\static"));
app.use('/static', express.static(path.join(__dirname,'/static')));
app.use(multer({storage:storageConfig, fileFilter: fileFilter}).single("img"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


app.use('/api/theaters', require('./routers/theatersRouter'));
app.use('/api/shows', require('./routers/showsRouter'));
app.use('/api/user', require('./routers/userRouter'));
app.use('/api/schedule', require('./routers/scheduleRouter'));

const httpsServer = https.createServer({
    key: fs.readFileSync('./certificate/localhost.key'),
    cert: fs.readFileSync('./certificate/localhost.crt')
},app);

const io = new Server(httpsServer, {
    cors: {
      origin: 'https://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

app.get('/qwe', (request,responce)=>{
    responce.end('qwe');
})

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
        console.log(data);
        socket.join(data);
    });

    socket.on("send_message", (data) => {
        console.log(data);
        // socket.to(data.room).emit("receive_message", data);
        socket.to(`${data.room}`).emit("receive_message", data);
    });
});

httpsServer.listen(PORT, ()=>{console.log(`HTTPS. Port = ${PORT}` )});