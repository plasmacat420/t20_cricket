import express from "express"
import {seeRooster, seeRooster_cred, seeRooster_name, seeRooster_power, createTeam, playGame} from "../controllers/rooster"
let Router:any  = express.Router()

Router.get('/seeRooster',seeRooster)
Router.get('/seeRooster/name/:id',seeRooster_name)
Router.get('/seeRooster/power/:id',seeRooster_power)
Router.get('/seeRooster/cred/:id',seeRooster_cred)
Router.use('/seeRooster/createTeam',createTeam)
Router.get('/Playgame',playGame)
export {Router}