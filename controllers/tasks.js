const express = require('express')
const mongodb = require('../functions/mongodb')



const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.post('/v1/tasks',(req,res)=>{
    let {title, tasks} = req.body
    
    let job = []
    let listOfIds = []
    let id = Math.floor(Math.random()*100000007484)
    if(title){

        job.push({title,is_completed:false, id})
    }else if(tasks){
        
        for (let index = 0; index < tasks.length; index++) {
            let idTemp = Math.floor(Math.random()*100000007484) 
            listOfIds.push(idTemp)
            tasks[index].id =  idTemp
        }
        job = tasks
    }

   try{ 
       mongodb.tasks.insertMany(job,(err, doc)=>{

        if(err){
            res.status(500).json({'message':'something went wrong'})
        }else if(doc){
              //  {id} or {tasks:[ids]}
              let output = {}
              if(title){
                  output.id = id
              }else if(tasks){
                  output = {tasks:listOfIds}
              }
                res.status(201).json(output)
        }

    })
}catch(e){
    console.log('error while inserting',{e})
    res.status(500)
}

})


router.get('/v1/tasks/:id',(req,res)=>{
    let {id} = req.params
    console.log({id})

  try{ 
       mongodb.tasks.findOne({id},(err,doc)=>{

        if(err){
            console.log('error ',err)
            res.status(500).json({'message':'something went wrong'})
        }else if(doc){
            let {id,title,is_completed} = doc
            if(!id) return res.status(404).json({  error: "There is no task at that id" })
            res.status(200).json({id, title, is_completed})

        }

    })
}catch(e){
    console.log('error ',e)
    res.status(500)
}

})


router.get('v1/tasks',(req,res)=>{

  try { 
       mongodb.tasks.find({},(err,doc)=>{
        if (err){
            console.log('error ',err)
            res.status(500).json({'message':'something went wrong'})
        }else if(doc){
            
            res.status(200).json({tasks:doc})
        }

    })
}catch(e){
    console.log('error getting all tasks ',e)
    res.status(500)
}

})


router.delete('v1/tasks/:id',(req,res)=>{

    let {id} = req.params

    try {
        mongodb.tasks.deleteOne({id},(err,doc)=>{

            if (err){
                console.log('error ',err)
                res.status(500).json({'message':'something went wrong'})
            }else if(doc){
                res.status(204)
            }

        })
        
    } catch (error) {
        console.log('error deleting task ',error)
        res.status(500)
    }


})


router.delete('v1/tasks',(req,res)=>{
    let {tasks} = req.body

    try {
        mongodb.tasks.deleteMany({id:{$in:tasks}},(err,doc)=>{
            if (err){
                console.log('error ',err)
                res.status(500).json({'message':'something went wrong'})
            }else if(doc){
                res.status(204)
            }
        })
    } catch (error) {
        console.log('error deleting task ',error)
        res.status(500)
    }
})

router.put('v1/tasks/:id',(req,res)=>{
    
    let {id} = req.params
    let {title, is_completed} = req.body

    try {
        mongodb.tasks.updateOne({id},{title,is_completed},(err,doc)=>{
            if (err){
                console.log('error ',err)
                res.status(500).json({'message':'something went wrong'})
            }else if(doc){
                if(doc.nMatched < 1 || doc.modifiedCount < 1) return res.status(404).json({  error: "There is no task at that id"} )
                res.status(204)
            }
        })
    } catch (error) {
        console.log('error deleting task ',error)
        res.status(500)
    }

})


module.exports = router