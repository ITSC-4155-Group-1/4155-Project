const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const userRoutes = require('./routes/userRoutes')
const venueRoutes = require('./routes/venueRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const cors = require ('cors')

const port = 3000
const app = express()
const url = "mongodb+srv://gatherlyAdmin:Es7eW3Wno1MA17rb@gatherly.oorgz.mongodb.net/Gatherly_Data"

// Database connect
mongoose.connect(url)
.then(() =>{
    app.listen(port, () => {
        console.log("Server is running!")
    })
})
.catch((err) => {
    console.log(err.message)
})

// Session creation and routing
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use(
    session({
        secret: "6yA'1%iO%sCn(|1q0<Ex1bf654",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongoUrl: "mongodb+srv://gatherlyAdmin:Es7eW3Wno1MA17rb@gatherly.oorgz.mongodb.net/Gatherly_Data"
            }),
        cookie: {
            maxAge: 60*60*3000,
            httpOnly: true,
            secure: false,
        }
    })
);

app.use('/test', (req, res) => {
    res.send("success")
})

app.use('/user', userRoutes)
app.use('/venue', venueRoutes)
app.use('/booking', bookingRoutes)

// Basic error handling
app.use((req, res, next) => {
    let err = new Error("Unable to locate route")
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    if(!err.status){
        let err = new Error("Critical server error")
        res.status = 500
    }
    res.status = err.status
    res.json({"error": {"status": res.status, "message": err.message}})
})