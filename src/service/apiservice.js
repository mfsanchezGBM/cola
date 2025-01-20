
const https = require("https");

const ACCESS_TOKEN = "EAAHYVuDQJcwBOzHvzVRVOUiN5n0u0W1u2pMpnSchI78owu244PrwR48JrubRBpKiGDbUWWcQNvRPFNPqJ1swIaytZA8UYjW3REgXUADxaWYq28X1OG0XBJrvZBDJ31E9t8UAZBgnBoQpOn8CXOZAMZAEeKk1reKL8b67X1UZA5dMnmfG97ze2IZBNzpZCumOkJKTJLAfHjlNmWrMalhSZCYDx3bKN";

// Lista de agentes disponibles (números de WhatsApp)
const availableAgents = [""];

// Estructuras en memoria
const timeoutHandlers = {}; // { clienteNumero: timeoutID }

// Tiempo de espera en milisegundos (5 minutos)
const TIMEOUT_DURATION = 5 * 60 * 1000; 


// Enviar mensajes a través de la API de WhatsApp Business
async function sendMessageToWhatsApp(phoneNumber, message) {
    try {
        const data = JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phoneNumber,
            "type": "text",
            "text": {
                "preview_url": false,
                body: message,
            }
        });

        const options = {
            host: "graph.facebook.com",
            path: "/v21.0/491109820752498/messages",
            method: "POST",
            body: data,
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
        
            }
        };

        const req = https.request(options,res =>{
            res.on("data",d=>{
                process.stdout.write(d);
            });
        });
    
        req.write(data);
        req.end();


        


        console.log(` ENTRO Y SE DEBIO ENVIAR EL MENSAJE Mensaje enviado a ${phoneNumber}: ${message}`);
        //return response.data;
    } catch (error) {
        console.error(`Error al enviar mensaje a ${phoneNumber}:`, error.response?.data || error.message);
        throw error;
    }
}

// Configurar temporizador para liberar al agente automáticamente
function setAgentTimeout(clientNumber, agentNumber) {
    if (timeoutHandlers[clientNumber]) {
        clearTimeout(timeoutHandlers[clientNumber]);
    }

    const timeoutID = setTimeout(() => {
        releaseAgent(agentNumber);
        delete timeoutHandlers[clientNumber];
        console.log(`Agente ${agentNumber} liberado por inactividad con cliente ${clientNumber}`);
    }, TIMEOUT_DURATION);

    timeoutHandlers[clientNumber] = timeoutID;
}

// Liberar un agente
function releaseAgent(agentNumber) {
    availableAgents.push(agentNumber); // Regresar el agente a la lista
    console.log(`Agente ${agentNumber} liberado`);
}

// Asignar un agente al cliente
async function assignAgent(clientNumber) {
    if (availableAgents.length > 0) {
        const assignedAgent = availableAgents.shift(); // Remover el primer agente disponible
        console.log(`Agente ${assignedAgent} asignado al cliente ${clientNumber}`);
        return assignedAgent;
    }
    return null; // No hay agentes disponibles
}

// Reiniciar temporizador cuando hay actividad
function resetAgentTimeout(clientNumber, agentNumber) {
    setAgentTimeout(clientNumber, agentNumber);
}

// Notificar al agente cuando se le asigna un cliente
async function notifyAgent(agentNumber, clientNumber, clientMessage) {
    const notificationMessage = `Tienes un nuevo cliente asignado:\nNúmero: ${clientNumber}\nMensaje: "${clientMessage}"`;
    try {
        await sendMessageToWhatsApp(agentNumber, notificationMessage);
        console.log(`Notificación enviada al agente ${agentNumber}`);
    } catch (error) {
        console.error(`Error al notificar al agente ${agentNumber}:`, error);
    }
}

function sendMessageWhatsApp(number, text){

    text = text.toLowerCase();

    if (text.includes("hola")) {
        var data = JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": number,
            "type": "text",
            "text": {
                "preview_url": false,
                "body": "Bienvenido(a) a Dirección de Recuperaciones. Es un gusto atenderle a través de nuestro asesor virtual de Grupo Mutual BOT.\n\n En esta conversación no se solicita información de usuario, contraseñas, claves o códigos.\n\n Digite el número de la opción requerida.\n1. Horarios de Centros de Negocios.\n2. Reporte de pago.\n3. Consulta Monto y Fecha de pago.\n4. Consulta cuenta IBAN de su operación de crédito para realizar pago.\n5. Solicitud de Estados de cuenta de operación de crédito.\n6. Atención de un ejecutivo de GM.”\n7. Postergar fecha de pago.\n8. Actualización de información.\nEste es un WhatsApp exclusivo para reportar comprobantes, solicitar montos de cuotas y brindar acuerdos de pago. De lo contrario su consulta debe ser atendida por unos de nuestros agentes al 2437-1000 opción 2."            }
        });
    } else if (text == 1) {
        var data = JSON.stringify({
            "messaging_product": "whatsapp",
            "to": number,
            "text": {
                "preview_url": true,
                "body": "Para mayor informacion visita nuestro sitio web: https://www.grupomutual.fi.cr/sucursales/"
            }
        });

    } else if (text == 6) {
        var data = JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": number,
            "type": "text",
            "text": {
                "preview_url": false,
                "body": "Horario de atención ejecutivo\n\n GM: lunes a viernes de 7:45 a.m. a 5:30 p.m.\nJornada continua. Sábados de 7:45 a.m. a 12:15 m.d."
            }
        });

        
    } else if (text == 8) {
        var data = JSON.stringify({
            "messaging_product": "whatsapp",
            "to": number,
            "text": {
                "preview_url": true,
                "body": "Para actualizar sus datos, por favor envíe la siguiente información.\nNombre y Apellidos\nFigura (Titular, encargado(a), Dueño registral, Fiador, Codeudor)\nTeléfono\nCorreo\nComentarios.\nCédula o DIMEX (con ceros y sin guiones)"
            }
        });

    } else {
        var data = JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": number,
            "type": "text",
            "text": {
                "preview_url": false,
                "body": "Digite el número de la opción requerida.\n1. Horarios de Centros de Negocios.\n2. Reporte de pago.\n3. Consulta Monto y Fecha de pago.\n4. Consulta cuenta IBAN de su operación de crédito para realizar pago.\n5. Solicitud de Estados de cuenta de operación de crédito.\n6. Atención de un ejecutivo de GM.”\n7. Postergar fecha de pago.\n8. Actualización de información.\nEste es un WhatsApp exclusivo para reportar comprobantes, solicitar montos de cuotas y brindar acuerdos de pago. De lo contrario su consulta debe ser atendida por unos de nuestros agentes al 2437-1000 opción 2."
            }
        });
    }
    
    /*const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "text",
        "text": {
            "preview_url": false,
            "body": "Bienvenido(a) a Dirección de Recuperaciones. Es un gusto atenderle a través de nuestro asesor virtual de Grupo Mutual BOT.\n\n En esta conversación no se solicita información de usuario, contraseñas, claves o códigos.\n\n Digite el número de la opción requerida.\n1. Horarios de Centros de Negocios.\n2. Reporte de pago.\n3. Consulta Monto y Fecha de pago.\n4. Consulta cuenta IBAN de su operación de crédito para realizar pago.\n5. Solicitud de Estados de cuenta de operación de crédito.\n6. Atención de un ejecutivo de GM.”\n7. Postergar fecha de pago.\n8. Actualización de información.\nEste es un WhatsApp exclusivo para reportar comprobantes, solicitar montos de cuotas y brindar acuerdos de pago. De lo contrario su consulta debe ser atendida por unos de nuestros agentes al 2437-1000 opción 2."
        }
    });*/

    const options = {
        host: "graph.facebook.com",
        path: "/v21.0/491109820752498/messages",
        method: "POST",
        body: data,
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN}`

        }
    };

    const req = https.request(options,res =>{
        res.on("data",d=>{
            process.stdout.write(d);
        });
    });

    req.write(data);
    req.end();
}

module.exports = {
    sendMessageToWhatsApp,
    assignAgent,
    releaseAgent,
    setAgentTimeout,
    resetAgentTimeout,
    notifyAgent,
    sendMessageWhatsApp
};

