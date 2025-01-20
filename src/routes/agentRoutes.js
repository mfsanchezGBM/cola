//Define las rutas para que los agentes interactúen con el sistema
const express = require('express');
const { sendMessageToClient, endSession } = require("../controller/agentController");
const router = express.Router();

router.post('/send', sendMessageToClient);
router.post('/end-session', endSession);

module.exports = router;
