// IMPORTING REQUIREMENTS
const express = require('express');
const dbConnect = require('./configs/db');
const router = require('./routes/user.route');
const app = express();
app.use(express.json());

// WELCOME ROUTE
app.get('/' , (req,res) =>{
    res.send('welcome');
})
// USER ROUTE
app.use("/api/user" , router)

// STARTING THE SERVER ON PORT 6000
app.listen(6000, () => {

    console.log('Server is running on port 6000');
    dbConnect()
    
});