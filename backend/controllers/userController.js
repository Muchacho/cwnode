const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient()
const fs = require('fs');


const getUserInfo = async(request, response) => {
    try{
        let userId = request.user.user_id
        let user = await prisma.users.findFirst({where:{user_id:userId}, select:{email:true, img_name:true, firstname:true, lastname:true}});
        response.status(200).json(user);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getCart = async(request, response) => {
    try{
        let token = request.headers["authorization"].split(' ')[1];
        let data = jwt.verify(token, process.env.JWT_SECRET);
        let bookedTickets = await prisma.bookedtickets.findMany({where:{user_id:data.id}});
        let schedule = [], show, theater, result = [];
        for(let item in bookedTickets){
            schedule.push(await prisma.schedule.findUnique({where:{schedule_id:bookedTickets[item].schedule_id}}));
        }
        for(let item in schedule){
            show = (await prisma.shows.findUnique({where:{show_id:schedule[item].show_id}}));
            theater = (await prisma.theaters.findUnique({where:{theater_id:schedule[item].theater_id}}));
            result.push({
                ticket_id: bookedTickets[item].ticket_id,
                name: show.name,
                schedule_id: schedule[item].schedule_id,
                show_id:show.show_id,
                price: schedule[item].price,
                time: schedule[item].start_time,
                theater_name: theater.name
            })
        }
        response.status(200).json(result);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const updateUser = async (request, response) => {
    try{
        let {firstname, lastname} = request.body;
        let userId = request.user.user_id;
        let file = request.file, filename = `${performance.now()}${file.originalname}`;
        fs.writeFileSync(`./static/${filename}`, file.buffer);
        await prisma.users.update({
            where: {
                user_id : userId
            },
            data: {
                firstname: firstname,
                lastname: lastname,
                img_name: filename
            }
        });
        response.status(201).json({message: 'ok'});
    }catch(error){
        console.log(error.message, 88);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getTicket = async(request, response) => {
    try{
        let bookedTicket = await prisma.bookedtickets.findUnique({where:{ticket_id:+request.params['id']}});
        let schedule = await prisma.schedule.findUnique({where:{schedule_id: +bookedTicket.schedule_id}});
        let show = await prisma.shows.findUnique({where:{show_id: +schedule.show_id}});
        let theater = await prisma.theaters.findUnique({where:{theater_id: +schedule.theater_id}});
        console.log(bookedTicket);
        let result = {
            ticket_id: bookedTicket.ticket_id,
            name: show.name,
            schedule_id: schedule.schedule_id,
            show_id: show.show_id,
            price: schedule.price,
            time: schedule.start_time,
            theater_name: theater.name,
            address: theater.address,
            price: schedule.price,
            place: bookedTicket.place
        }
        response.status(201).json(result);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const changePassword = async (request, response) => {
    try{
        let newPassword = request.body.password;
        let userId = request.user.user_id;
        let salt = await bcrypt.genSalt(10);
        let hashedNewPassword = await bcrypt.hash(newPassword, salt);
        await prisma.users.update({
            where: {
                user_id : userId
            },
            data: {
                hash_password: hashedNewPassword
            }
        });
        response.status(201).json({message: 'ok'});
    }catch(error){
        console.log(error.message, 88);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const deleteTicket = async (request, response) => {
    try{
        console.log(123);
        let ticketId = +request.params['id'];
        await prisma.bookedtickets.deleteMany({where:{ticket_id:ticketId}});
        response.status(201).json({message: 'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}


const deleteUser = async (request, response) => {
    try{
        let userId = +request.user.user_id;
        await prisma.bookedtickets.deleteMany({where:{user_id:userId}});
        await prisma.commets.deleteMany({where:{user_id:userId}})
        await prisma.users.delete({where:{user_id:userId}});
        response.status(201).json({message: 'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

module.exports = {
    getUserInfo, getCart, getTicket, changePassword, deleteTicket, deleteUser, updateUser
}