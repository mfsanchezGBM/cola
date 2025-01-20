const agents = [
    { phone: "50376646334", busy: false }, // Agente 1
    { phone: "50376646334", busy: false }, // Agente 2
]; // Lista de agentes con sus números de teléfono

// Modelo para manejar los agentes

// Obtener un agente disponible
exports.getAvailableAgent = () => agents.find(agent => !agent.busy);

// Marcar un agente como ocupado
exports.markBusy = (agentPhone) => {
    const agent = agents.find(agent => agent.phone === agentPhone);
    if (agent) agent.busy = true;
};

// Marcar un agente como disponible
exports.markAvailable = (agentPhone) => {
    const agent = agents.find(agent => agent.phone === agentPhone);
    if (agent) agent.busy = false;
};

// Obtener información de un agente por su número de teléfono
exports.getAgentByPhone = (agentPhone) => agents.find(agent => agent.phone === agentPhone);

