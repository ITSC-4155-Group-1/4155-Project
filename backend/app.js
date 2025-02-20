const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')

const port = 3000
const app = express()
const url = "mongodb+srv://gatherlyAdmin:L6}1mU5m5NLe@gatherly.oorgz.mongodb.net/"


mongoose.connect(url)
.then(() =>{
    app.listen(port, () => {
        console.log("Server is running!")
    })
})
.catch((err) => {
    console.log(err.message)
})


app.use(morgan('dev'))
app.use('/test', (req, res) => {
    res.send("success")
})
app.use((req, res, next) => {
    let err = new Error("Unable to locate route")
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    if(!err.status){
        let err = new Error("Critical server error")
        res.status = 500
        res.json({"error": {"status": res.status, "message": err.message}})
    }
    res.status = err.status
    res.json({"error": {"status": res.status, "message": err.message}})
})