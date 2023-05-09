require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT||3000;

// app.use(express.static(__dirname + "\\static"));
app.use('/static', express.static(path.join(__dirname,'/static')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api/theaters', require('./routers/theatersRouter'));
app.use('/api/shows', require('./routers/showsRouter'));
app.use('/api/user', require('./routers/userRouter'));

app.listen(PORT, ()=>{console.log('port = ' + PORT)});