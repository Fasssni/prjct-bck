const express=require('express')
const cors= require("cors")
const cookieParser= require("cookie-parser")

const messageRoutes=require("./Routes/botRoutes.js")
const userRoutes=require("./Routes/userRoutes.js")
const interfaceRoutes=require("./Routes/interfaceRoutes.js")

const db = require('./Models/index.js')
const { catchMessage,startBots} = require('./Controllers/tgControllers.js')

const TelegramApi = require("node-telegram-bot-api")


const PORT=process.env.PORT||3000
const WBhost=process.env.WEBSOCKET

const app=express()


app.use(cookieParser())
app.use(cors({
    credentials:true, 
    origin:WBhost
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.use("/apiv/",userRoutes,interfaceRoutes)
app.use("/tg/", messageRoutes)

db.sequelize.sync({ force: false }).then(() => {
    console.log("db has been re sync")
})


const {removeChatByBotId} =require("././Services/ConversationService.js")

async function startApp(){ 
    try{ 
        app.listen(PORT,console.log(`it's all started at ${PORT}`))
        await catchMessage()
    }catch(e){ 
         console.log(e.message)
    }
}

startApp()

