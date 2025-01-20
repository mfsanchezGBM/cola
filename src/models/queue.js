const queue = [];

exports.addToQueue = (client) => {
    if (!queue.includes(client)) queue.push(client);
};

exports.getNextClient = () => queue.shift();

exports.isInQueue = (client) => queue.includes(client);
