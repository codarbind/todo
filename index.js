const express = require('express')
const app = express()
const tasks = require('./controllers/tasks')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(tasks)

let port = process.env.port || 3000
app.listen(port, ()=>console.log('listening at port ', port))



