const express = require('express')


const app = express()

app.listen(3000, (err)=>{
    if(err){
        console.log("ERROR")
    }
    else{
        console.log("running on 3000")
    }
})