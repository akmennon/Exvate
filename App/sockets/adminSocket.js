const io = require('../../servers').io
const mongoose = require('mongoose')

const User = mongoose.model('User')

/*-------------------- Admin Socket [Checks admin authentication and session using sockets] --------------------*/
io.of('/admin').on('connection',(socket)=>{

    let adminToken

    console.log('connected to admin socket')

    /*-------------------- Authenticates the admin --------------------*/
    socket.on('login',async (creds)=>{
        const admin = await User.adminLogin(creds.email,creds.password)

        try{

            /* Checks if the admin already has a session*/
            if(io.of('/admin').adapter.rooms[admin._id]){
                Promise.reject('Already logged in')
            }

            /* creates a room with admin's id */
            socket.join(admin._id)

            /* Creates a token for the admin */
            adminToken = await admin.generateAdminToken()

            /* Token is sent back to the frontend */
            socket.emit('token',{token:adminToken})
        }
        catch(err){
            console.log(err)
        }
    })

    /*-------------------- Logs out as well as remove the token --------------------*/
    socket.on('disconnect',async (reason)=>{
        try{
            const result = await User.updateOne({'isAdmin.token':adminToken},{$unset:{'admin.isAdmin.token':''}})
            console.log(result)
        }
        catch(err){
            console.log(err)
        }
    })

})