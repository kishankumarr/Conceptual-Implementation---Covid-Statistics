const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

const covidTallyModel=connection;
app.get("/totalrecovered",async(req,res)=>{
    const resDoc=await covidTallyModel.aggregate([
        {
            $group:{
                _id:"total",
                recovered:{$sum:"$recovered"},
               count:{$sum:1}
            },
        },
    ]);
    res.send(resDoc);
});

app.get("/totalActive",async(req,res)=>{
    const resDoc=await covidTallyModel.aggregate([
        {
            $group:{
                _id:"total",
                recovered:{$sum:"$recovered"},
                infected:{$sum:"$infected"},
            }
    },
    ]);
    const Result=resDoc[0];
    res.send({data:{_id:"total",active:Result.infected-Result.recoverd}});
});


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;