const https = require('https');

const ACCESS_TOKEN = "EAAHYVuDQJcwBO9sdYavWRDBq5Igm7ah0Pua2ZA7f4Hx9UYL0DugxGH3MpH1hHZBLkZAAVv20te08eqkvLYMrxHBZCqsiV7eaWXfKTWk6iOdms7oXSObUbMCGinR1g40fRzylR9PMPlxbJdv4jIzQ4mGfVDpETouCZCAl6vy8RvjZBRpmktkj2axM7X2Jh8MArOAeLNvSuMXlxkZCUPZAW9txWfUZC"; // Token de acceso de la API de WhatsApp

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
