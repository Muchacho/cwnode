// index.js
const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8')

const httpServer = require('http').createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(content))
  res.end(content)
})

let kq = 0;

let room;


const io = require('socket.io')(httpServer)

io.on('connection', socket => {
        socket.join('1');
    console.log(socket.id, kq);
  let counter = 0
    // отправляем данные клиенту
    socket.on('hello', data=>{
        console.log(data);
        io.emit('hello', data);
    })
  // получаем данные от клиента
  socket.on('hi', data => {
    console.log('hi', data)
  })
})

httpServer.listen(3010, () => {
  console.log('Перейдите на http://localhost:3000')
})



console.log(+'04' < new Date().getMonth());