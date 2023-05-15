const fs = require('fs');
let arr = fs.readFileSync('D:\\projects\\BSTU\\6\\Kurs\\app\\backend\\static\\85.jpg');
// fs.copyFileSync('D:\\projects\\BSTU\\6\\Kurs\\app\\backend\\static\\D:\\projects\\BSTU\\6\\Kurs\\app\\backend\\static\\85.jpg', 'D:\\projects\\BSTU\\6\\Kurs\\app\\backend\\static\\q');
fs.writeFileSync('D:\\projects\\BSTU\\6\\Kurs\\app\\backend\\static\\q\\86.jpg', arr);
console.log(arr);