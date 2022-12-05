import express from "express"
import {Router} from "./routes/rooster"
import * as bodyParser from "body-parser"
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/",Router)


app.listen(3000,()=>{
    console.log("SERVER started on 3000")
})

