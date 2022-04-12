const mongoose = require('mongoose')

let url = `mongodb+srv://fitteduser:fitteduser@cluster0.x9wyz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const db = mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology:true})

const Schema = mongoose.Schema

const TasksSchema = new Schema({
    title: String,
    id: Number,
    is_complete: Boolean
})

const Model = mongoose.model

const Tasks = Model('tasks',TasksSchema)

module.exports = Tasks