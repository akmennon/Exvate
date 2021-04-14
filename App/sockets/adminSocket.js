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
            socket.emit('token',{err:err})
        }
    })

    /*-------------------- Logs out as well as remove the token --------------------*/
    socket.on('disconnect',async (reason)=>{
        try{
            const admin = await User.findOne({'isAdmin.token':adminToken})
            admin.isAdmin.token = undefined
            await admin.save()
        }
        catch(err){
            console.log(err)
        }
    })

})