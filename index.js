const express =require('express')
const path= require('path')

//database closer
const db=require('./config/mongoose')
const TodoListSchema = require('./models/task')
const TaskCompleted = require('./models/completedtask')

const app = express();
const port = 8000

//middleware
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded())
app.use(express.static('./assets'))


// default path request handler
app.get('/',function(req,res){

    TodoListSchema.find({completed:false},function(err,tasks){
        if(err){
            console.log("Error in fetching")
            return
        }
        return res.render('home',{
            Task:tasks
        })
    })
    // return res.redirect("/profile")
})


//delete entry request handler
app.get('/delete/',function(req,res){
    let id=req.query.id;
    
    TodoListSchema.findByIdAndDelete(id,function(err){
        if(err){
            console.log("ERROR")
            return;
        }
       return  res.redirect('back')

    })
})


// completed task request handler "this removes the tasks from the tasks cards and adds them to the completed list"
app.get('/completed/',function(req,res){
    let id=req.query.id;
    TodoListSchema.findByIdAndUpdate(id,{completed:true},function(err){
        if(err){
            console.log("ERROR")
            return;
        }
        return res.redirect('back')

    })
})

//this one routes to the new file that renders the task's that are completed
app.get('/finished',function(req,res){

    TodoListSchema.find({completed:true},function(err,tasks){
        if(err){
            console.log("Error in fetching")
            return
        }
        return res.render('finished',{
            Task:tasks
        })
    })
})


//this adds the new to od task to database and renders to the main page
app.post('/add-to-list',function(req,res){

    console.log(req.body)
    
    //  var elem= document.getElementsById('category-list').value;


    TodoListSchema.create({
        desc:req.body.task,
        category:req.body.taskCategory,
        date:req.body.taskDate,
        completed:false
    },
    function(err,newTask){
        if(err){
            console.log("err")
            return;
        }

        console.log("Created");
        res.redirect('back');
    })

})


//server 
app.listen(port, function(err){
    if(err){
        console.log("ERROR")
    }
    console.log("SERver running at port :",port);

})