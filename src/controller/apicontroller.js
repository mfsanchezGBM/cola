const sendMessage = require("../service/apiservice");
const messageUtils = require("../utils/messageUtils");

// Cola de espera y agentes activos
const waitingQueue = [];
const activeChats = {}; // { clientNumber: agentPhoneNumber }
const availableAgents = [
    { phone: "50377463793", busy: false }, // Agente 1
    { phone: "", busy: false }, // Agente 2
]; // Lista de agentes con sus números de teléfono


const verificar = (req, res) => {

    try {
        let tokengroupmutual = "GRUPOMUTUALAPIMETA";
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];

        if (challenge != null && token != null && token == tokengroupmutual) {
            res.send(challenge);
        } else {
            res.status(400).send;
        }

        console.log(req);

    } catch (e) {
        res.status(400).send();
    }

    res.send("Verificado");
    console.log("Verificado Consola");
}

const recibir = async (req, res) => {
    try {
        const entry = req.body?.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const objMessage = value?.messages;

        if (objMessage) {
            const messages = objMessage[0];
            const number = messages.from; // Número del remitente
            const text = messages.text?.body || null; // Texto del mensaje

            console.log(`Mensaje recibido de ${number}: ${text}`);

            // Verificar si el mensaje proviene de un agente
            const agent = availableAgents.find(agent => agent.phone === number);

            if (agent) {
                console.log("Active Chats:", JSON.stringify(activeChats, null, 2));

                // Mensaje enviado por un agente
                const assignedClient = Object.keys(activeChats).find(client =>
                    activeChats[client].agentPhone === number

                );

                console.log(`Entra en validacion de agente: ${agent.phone}`);
                console.log(`Cliente asignado: ${assignedClient}`);

                if (assignedClient) {
                    messageUtils.sendMessage(assignedClient, `Mensaje del agente: ${text}`);
                } else {
                    messageUtils.sendMessage(number, "No tienes clientes asignados actualmente.");
                }

                if (text.includes("encuesta")){
                    endSession(agent.phone, assignedClient);
                    console.log("Se cierra la sesion con cliente");
                }

                for (const client in activeChats) {     
                    console.log(`Cliente: ${client}, Datos:`, activeChats[client]);
                }

                return res.send("EVENT_RECEIVED");
            } else {
                // Verificar si el cliente está en una conversación activa;
                if (activeChats[number]) {
                    const agentPhone = activeChats[number];

                    console.log(`Entra en verificacion si cliente posee conversacion activa:`);
                    console.log(`${agentPhone}`);

                    messageUtils.sendMessage(agentPhone, `Mensaje del cliente ${number}: ${text}`);
                } else if (text === "6") {
                    // Registrar cliente en la cola
                    if (!waitingQueue.includes(number)) {
                        waitingQueue.push(number);
                        messageUtils.sendMessage(number, "Has sido registrado en la cola. Por favor, espera mientras un agente te contacta.");
                        assignAgent(); // Intentar asignar un agente
                    } else {
                        messageUtils.sendMessage(number, "Ya estás en la cola. Por favor, espera mientras te asignamos un agente.");
                    }
                } else {
                    messageUtils.sendMessage(number, "Mensaje recibido. Selecciona una opción del menú.");
                }
            }
        }

        res.send("EVENT_RECEIVED");
    } catch (e) {
        console.error("Error procesando mensaje:", e);
        res.send("EVENT_RECEIVED");
    }
};

// Función para enviar mensaje al agente desde el cliente
const sendMessageToAgent = (agentPhone, clientNumber, text) => {
    sendMessage(agentPhone, `Mensaje del cliente ${clientNumber}: ${text}`);
};

// Función para asignar un agente a un cliente
const assignAgent = () => {
    console.log(`linea 119 Cola de espera: ${waitingQueue.length}`);
    if (waitingQueue.length > 0) {
        const availableAgent = availableAgents.find(agent => !agent.busy);
        console.log(`revision agente disponible: ${availableAgent.phone}` );

        if( availableAgent.phone != '' && availableAgent.phone != undefined ){
            if (availableAgent) {
                const client = waitingQueue.shift(); // Sacar al cliente de la cola
                console.log(`Cliente sacado de cola de espera: ${client}`);
                availableAgent.busy = true; // Marcar al agente como ocupado
                
                activeChats[client] = { agentPhone: availableAgent.phone }; //Insertar 
                console.log("Active Chats:", JSON.stringify(activeChats, null, 2));

                // Notificar al cliente y al agente
                //messageUtils.sendMessage(client, `Hola, soy tu agente asignado. Estoy aquí para ayudarte.`);
                messageUtils.sendMessage(availableAgent.phone, `Nuevo cliente asignado: ${client}.`);
                console.log(`Cliente ${client} asignado al agente ${availableAgent.phone}`);
            } else {
                console.log("No hay agentes disponibles en este momento.");
            }
        } else {
            console.log(`no hay agente disponibles en este momento, clientes en cola ${waitingQueue.length}`);
        }
    }
};

// Función para finalizar una sesión
const endSession = (agentPhone, clientNumber) => {
    console.log("Active Chats:", JSON.stringify(activeChats, null, 2));
    if (activeChats[clientNumber] && activeChats[clientNumber].agentPhone === agentPhone) {
        delete(activeChats[clientNumber]); // Eliminar la sesión activa
        const agent = availableAgents.find(agent => agent.phone === agentPhone);
        if (agent) agent.busy = false; // Marcar al agente como disponible
        console.log("Active Chats:", JSON.stringify(activeChats, null, 2));
        console.log(`Sesión finalizada entre el cliente ${clientNumber} y el agente ${agentPhone}`);
        console.log(`linea 150 Cola de espera: ${waitingQueue.length}`);
        assignAgent();
    }
    //llama la funcion que revisa la cosa de espera
    //processQueue();
};

//Función que revisa la cola de espera y llama la funcion assignAgent si hay usuarios esperando
const processQueue = () => {
    console.log("Procesando la cola de espera...");
    console.log(`linea 160 Cola de espera: ${waitingQueue.length}`);
    if (waitingQueue.length > 0) {
        assignAgent();
    } else {
        console.log("No hay clientes en la cola de espera.");
    }
};

// Configurar un intervalo para revisar la cola cada cierto tiempo
const startQueueProcessor = (interval = 600000) => {
    console.log(`Iniciando el procesador de la cola con un intervalo de ${interval} ms`);
    setInterval(processQueue, interval);
};

//startQueueProcessor(5000);

// Exportar funciones
module.exports = {
    verificar,
    recibir,
    assignAgent,
    endSession,
    processQueue,
    startQueueProcessor
};