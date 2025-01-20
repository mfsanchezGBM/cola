const https = require('https');

const ACCESS_TOKEN = "EAAHYVuDQJcwBOxVKtyr3ZAjLQjoTx2w3lWyni1fZATxXZCjHc8ySAxQRUdMFnvgAoToZC1ZAAmyvLuEBgHD1PaaZAPFT8JuX8cT2BbZBh1kZAjKy6qg48EwZCidnuXlbgHcHRplxQJObcOz2dngqr8yjivo1P9OyCzw3SfZCgH8SPuc6eJiTjZAB5ED1wEh63Py35bH9O8re8NFzmZBvZAZA9jKQ44ZB1jHJgZDZD"; // Token de acceso de la API de WhatsApp

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
