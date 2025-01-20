//const agents = require('../models/agents');
const chats = require('../models/chats');
const { sendMessage } = require('../utils/messageUtils');

//Controla las acciones de los agentes.

exports.sendMessageToClient = (req, res) => {
    const { agentId, clientNumber, message } = req.body;

    if (chats.isAgentAssignedToClient(agentId, clientNumber)) {
        sendMessage(clientNumber, message);
        res.send({ message: "Mensaje enviado al cliente." });
    } else {
        res.status(400).send({ message: "No estás asignado a este cliente." });
    }
};

exports.endSession = (req, res) => {
    const { agentId, clientNumber } = req.body;

    if (chats.isAgentAssignedToClient(agentId, clientNumber)) {
        chats.endChat(clientNumber);
        //agents.markAvailable(agentId);
        res.send({ message: "Sesión finalizada." });
    } else {
        res.status(400).send({ message: "No tienes una sesión activa con este cliente." });
    }
};