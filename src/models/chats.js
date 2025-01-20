
const activeChats = {};

//Modelo para manejar las sesiones activas.

exports.startChat = (client, agentId) => {
    activeChats[client] = agentId;
};

exports.getAgentForClient = (client) => activeChats[client];

exports.isClientActive = (client) => !!activeChats[client];

exports.isAgentAssignedToClient = (agentId, client) => activeChats[client] === agentId;

exports.endChat = (client) => {
    delete activeChats[client];
};
