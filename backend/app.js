require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');
const multer = require('multer');
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
    key: fs.readFileSync('./certificate/key.pem'),
    cert: fs.readFileSync('./certificate/cert.pem')
},app);

app.get('/qwe', (request,responce)=>{
    responce.end('qwe');
})

httpsServer.listen(PORT, ()=>{console.log(`HTTPS. Port = ${PORT}` )});