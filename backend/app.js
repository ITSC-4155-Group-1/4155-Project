const express = require('express')

const port = 3000
const app = express()





app.get('/', (req, res) => {
    console.log("home page")
    res.json({"sample data 1": {"attribute 1" : "value 1","attribute 2" : "value 2" }, "sample data 2": {"attribute 1" : "value 1","attribute 2" : "value 2" }})
})

app.listen(port, (err))
.then(() => {
    console.log("Server is running!")
})
.catch((err)=>{
    console.log(err.message);
})


app.use((req, res, next) => {
    let err = new Error("Unable to locate route")
    err.status = 404
    next()
})

app.use((err, req, res, next) => {
    if(!err.status){
        res.status = 404
        res.json({"error": {"status": 404, "message": err.message}})
    }
    let err = new Error("Critical server error")
    res.status = 500
    res.json({"error": {"status": 500, "message": err.message}})
})