const https = require('https');

const ACCESS_TOKEN = "EAAHYVuDQJcwBO4ZAB2UrDz2Q6CfVGmzjAUZB1kCQVhp674vCVKSX9lhGVMJN88Cie7nFlZCE6aA5mZBwBjkaaqd29iHeMsxwfMW8gKShmpQZBZAAnuXLyxngeZB4W3LUOOofLVZANTy3Jdk2RkPwWEcmsZC0spdt909lZAxPhCKREQXuR5RXxgZBPogXo2JnZCLpaHF5LdG3V67oZBsWxpSAYuuH1V5Cr"; // Token de acceso de la API de WhatsApp

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
