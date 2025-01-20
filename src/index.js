
//Importacion de framework
const express = require("express");

//Importacion de rutas generadas
const apiroute = require("./routes/route");
const agentRoutes = require('./routes/agentRoutes');

//asignacion de framework para estar instanciando
const app = express(); 

//Puerto a utilizar
const PORT = process.env.PORT || 3000;

//notacion a utilizar JSON
app.use(express.json());

//asignacion de rutas
app.use("/api", apiroute);
app.use("/agent", agentRoutes);

app.listen(PORT, () => {
    console.log("Hola el puerto es: " + PORT);
})