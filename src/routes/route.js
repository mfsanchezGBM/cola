//Llamado de framework
const express = require("express");
//Implentacion de router para mapeo
const router = express.Router();
//Import de controlador
const apicontroller = require("../controller/apicontroller");


router 
.get("/",apicontroller.verificar)
.post("/",apicontroller.recibir)

module.exports = router;