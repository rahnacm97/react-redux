const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const DB = require('./DB/db')
const userRouter = require('./Router/userRouter')
const adminRouter = require('./Router/adminRouter');
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config()

//CORS Origin
app.use(cors({
  origin:'http://localhost:5173'
}))

app.use(bodyParser.json())

app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/api/auth',userRouter);
app.use('/api/admin',adminRouter)

DB()

app.listen(3000,()=>{
    console.log('server 3000 is running')
})