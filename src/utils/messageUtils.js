const https = require('https');

const ACCESS_TOKEN = "EAAHYVuDQJcwBOzHvzVRVOUiN5n0u0W1u2pMpnSchI78owu244PrwR48JrubRBpKiGDbUWWcQNvRPFNPqJ1swIaytZA8UYjW3REgXUADxaWYq28X1OG0XBJrvZBDJ31E9t8UAZBgnBoQpOn8CXOZAMZAEeKk1reKL8b67X1UZA5dMnmfG97ze2IZBNzpZCumOkJKTJLAfHjlNmWrMalhSZCYDx3bKN"; // Token de acceso de la API de WhatsApp

exports.sendMessage = (to, message) => {
    //const phoneNumberId = "TU_PHONE_NUMBER_ID";

    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
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

    const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            console.log(`Mensaje enviado a ${to}: ${message}`);
            console.log("Respuesta de la API:", JSON.parse(responseData));
        });
    });

    req.on('error', (error) => {
        console.error(`Error enviando mensaje a ${to}:`, error.message);
    });

    // Enviar los datos en la solicitud
    req.write(data);
    req.end();
};
