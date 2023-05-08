const express=require('express')
const cors=require('cors')
const cookieParser =require('cookie-parser')
require('./DB/DB');
const router=require('./API.js')
const User=require('./Model/User')

const app=express();
app.use(express.json());
app.use(cors());
app.use(cookieParser())
app.use('/',router)

app.get('/',(req,res)=>{
    res.send("Hello login world from the server");
    res.end()
});


app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});