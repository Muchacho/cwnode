export const Paths = {
    home:'/',
    status:'/api/status',

    theaters:'/api/theaters',
    theater:'/api/theaters',
    getFullTheaterInfo:'/api/theaters/theaterInfo',
    addTheater:'/api/theaters/add',
    deleteTheater:'/api/theaters/delete',
    updateTheater:'/api/theaters/update',
    addArea: '/api/theaters/addArea',
    
    actor:'/api/theaters/actor',
    addActor:'/api/theaters/addActor',
    deleteActor:'/api/theaters/delActor',
    updateActor:'/api/theaters/updActor',

    shows: '/api/shows',
    show: '/api/shows',
    addShow: '/api/shows/add',
    deleteShows: '/api/shows/delete',
    updateShows: '/api/shows/update',

    schedule: '/api/schedule',
    scheduleItem: '/api/schedule',
    addScheduleItem: '/api/schedule/add',
    deleteScheduleItem: '/api/schedule/delete',
    updateScheduleItem: '/api/schedule/update',

    user: '/api/user',
    login: '/api/user/login',
    register: '/api/user/register',
    updateUser: '/api/user/update',
    cart: '/api/user/cart',
    addComment: '/api/shows/comment',
    changePassword: '/api/user/changePassword',
    deleteUser: '/api/user/delete',
    ticket: '/api/user/ticket',

    purchase: '/api/schedule/purchase',
    chat: '/api/chat'
} as const;