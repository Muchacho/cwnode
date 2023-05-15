const { PrismaClient } = require('@prisma/client');
const { request, response } = require('express');
const prisma = new PrismaClient()

const getSchedule = async (request, response) => {
    try{
        let schedule = await prisma.schedule.findMany();
        let result = [];
        let shows = [], theaters = [], resultSchedule = [];
        for(let item in schedule){
            date = new Date(schedule[item].start_time);
            console.log(date, new Date());
            if(new Date() > date){
                await prisma.bookedtickets.deleteMany({where:{schedule_id: schedule[item].schedule_id}});
                await prisma.schedule.delete({where: {schedule_id: schedule[item].schedule_id}});
            } else {
                resultSchedule.push(schedule[item]);
            }
        }
        for(let item in resultSchedule){
            shows.push(
                await prisma.shows.findUnique({where: {show_id: resultSchedule[item].show_id}})
            )
            theaters.push(
                await prisma.theaters.findUnique({where: {theater_id: resultSchedule[item].theater_id}})
            )
        }
        // console.log(12);
        // console.log(theaters);
        for(let item in resultSchedule){
            result.push({
                schedule_id: resultSchedule[item].schedule_id,
                show_id: shows[item].show_id,
                name: shows[item].name,
                theater_id: theaters[item].theater_id,
                start_time: resultSchedule[item].start_time,
                price: resultSchedule[item].price? resultSchedule[item].price : 'Узнайте в кассе театра'
            })
        } 

        response.status(200).json(result);
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getScheduleItem = async (request, response) => {
    try{

        let schedule = await prisma.schedule.findUnique({where: {schedule_id: +request.params['id']}});
        let show = await prisma.shows.findUnique({where: {show_id: schedule.show_id}});
        let theater = await prisma.theaters.findUnique({where: {theater_id: schedule.theater_id}});
        let area = await prisma.acting_area.findUnique({where: {area_id: schedule.area_id}});
        let result = {
            schedule_id: schedule.schedule_id,
            time: schedule.start_time,
            name: show.name,
            capacity: area.capacity
        }
        response.status(200).json(result);


        // let show = await prisma.shows.findFirst({where:{show_id:+request.params['id']}});
        // let schedule = await prisma.schedule.findMany({where:{show_id:show.show_id}});
        // let theaters = [];
        // let startTime;
        // for(let item in schedule){
        //     theaters.push(await prisma.theaters.findUnique({where:{theater_id:schedule[item].theater_id}}));
        // }
        // let result = {}, scheduleRes = [];
        // for(let item in schedule){
        //     startTime = schedule[item].start_time;
        //     result = {
        //         schedule_id: schedule[item].schedule_id,
        //         price: schedule[item].price ? schedule[item].price : 'Узнайте в кассе театра',
        //         start_time:`Дата: ${startTime.getFullYear()}-${startTime.getMonth()+1}-${startTime.getDate()}\nВремя: ${startTime.getHours()}-${startTime.getMinutes() == 0? '00' : startTime.getMinutes()}`,
        //         name: theaters[item].name
        //     }
        //     scheduleRes.push(result);
        // }       
        // response.status(200).json({show:show, schedule: scheduleRes});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const addSchedule = async (request, response) => {
    try{
        let regex = new RegExp("^([1-2][0-9]{3})\\-([0-9]{2})\\-([0-9]{2})\\ ([0-9]{2})\\:([0-9]{2})$");
        let {theater, area, show_id, start_time, price} = request.body;
        console.log(regex.test(start_time));
        if(!theater || !area || !show_id || !start_time || !price)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        if(!regex.test(start_time))return response.status(400).json({message: 'Неверный формат даты и времени'});
        let theaterInfo = await prisma.theaters.findFirst({where:{name:theater}});
        let areaInfo = await prisma.acting_area.findFirst({where:{theater_id:theaterInfo.theater_id, num: +area}});
        // console.log(time);
        // if(await prisma.schedule.findFirst({where:{theater_id:+theater_id, area_id: +area_id, start_time: time}})) return response.status(400).json({message: 'В расписании уже существует данная запись'});
        await prisma.schedule.create({
            data: {
                theater_id: +theaterInfo.theater_id,
                area_id: +areaInfo.area_id,
                show_id: +show_id,
                start_time: start_time,
                price: +price
            }
        });
        // let {name, description, duration} = request.body;
        // if(!name || !description || !duration)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        // if(await prisma.shows.findFirst({where:{name:name}})) return response.status(400).json({message: 'Представление с таким именем уже существует'});
        // let result = await prisma.shows.create({
        //     data: {
        //         name: name,
        //         description: description,
        //         duration: +duration,
        //         rating: null
        //     }
        // });
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const deleteSchedule = async (request, response) => {
    try{
        let schedule_id = +request.params['id'];
        // console.log(request.body);
        if(!schedule_id)return response.status(400).json({message: 'Пожалуйста, заполните обязательные поля'});
        await prisma.bookedtickets.deleteMany({where:{schedule_id:schedule_id}});
        await prisma.schedule.delete({where:{schedule_id:schedule_id}});
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const updateSchedule = async (request, response) => {
    try{
        // console.log(request.body);
        let {schedule_id,show_id, theater_id, area_id, start_time, price} = request.body;
        if(!schedule_id || !show_id || !theater_id || !area_id || !start_time || !price)return response.status(400).json({message: 'Пожалуйста, заполните обязательные пол1я'});
        await prisma.schedule.update({
            where:{
                schedule_id:schedule_id
            },
            data:{
                show_id:show_id,
                theater_id:theater_id,
                area_id:area_id,
                start_time:start_time,
                price:price
            }
        });
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const bookTicket = async (request, response)=> {
    try{
        console.log(request.body);
        let {schedule_id, place, user_id} = request.body;
        if(!schedule_id || !place || !user_id)return response.status(400).json({message: 'Пожалуйста, заполните обязательные пол1я'});
        await prisma.bookedtickets.create({
            data:{
               schedule_id: +schedule_id,
               place: +place,
               user_id: +user_id
            }
        });
        response.status(201).json({message:'ok'});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

const getTickets = async (request, response) => {
    try{
        let schedule_id = +request.params['id'];
        let tickets = await prisma.bookedtickets.findMany({where: {schedule_id: schedule_id}});
        response.status(200).json(tickets);


        // let show = await prisma.shows.findFirst({where:{show_id:+request.params['id']}});
        // let schedule = await prisma.schedule.findMany({where:{show_id:show.show_id}});
        // let theaters = [];
        // let startTime;
        // for(let item in schedule){
        //     theaters.push(await prisma.theaters.findUnique({where:{theater_id:schedule[item].theater_id}}));
        // }
        // let result = {}, scheduleRes = [];
        // for(let item in schedule){
        //     startTime = schedule[item].start_time;
        //     result = {
        //         schedule_id: schedule[item].schedule_id,
        //         price: schedule[item].price ? schedule[item].price : 'Узнайте в кассе театра',
        //         start_time:`Дата: ${startTime.getFullYear()}-${startTime.getMonth()+1}-${startTime.getDate()}\nВремя: ${startTime.getHours()}-${startTime.getMinutes() == 0? '00' : startTime.getMinutes()}`,
        //         name: theaters[item].name
        //     }
        //     scheduleRes.push(result);
        // }       
        // response.status(200).json({show:show, schedule: scheduleRes});
    }catch(error){
        console.log(error.message);
        response.status(500).json({message: 'Что-то пошло не так'});
    }
}

module.exports = {
    getSchedule, getScheduleItem, addSchedule, deleteSchedule, updateSchedule, bookTicket, getTickets
}

// getAll, getShow, addShow, deleteShow, updateShow}
