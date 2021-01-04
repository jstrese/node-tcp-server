const net = require('net');
const con = require('../../shared/connections');

var client;

async function send(data, type = con.NET.SERVER_MESSAGE) {
    con.send(client, data, type)
}

async function listen(port) {
    try {
        const connection = net.createConnection({ port: port }, () => {
            console.log('! Connected to the server');
        });
        
        connection.on('data', (data) => {
            onData(data);
        });

        connection.on('error', () => {
            console.log('Client errored out');
            onErr(port);
        });
        
        connection.on('end', () => {
            console.log('Client disconnected from server.');
            onErr(port);
        });

        client = connection;

        return true;
    } catch (ex) {
        return ex.message;
    }
}

async function onData(data) {
    let payload = con.parse(data);

    switch(payload.type) {
        case con.NET.PINGPONG:
            con.send(client, 'pong', con.NET.PINGPONG);
            break;
        case con.NET.PRIVATE_MESSAGE:
            break;
        case con.NET.PUBLIC_MESSAGE:
            console.log(`> Room: ${payload.data[0]}`);
            break;
        case con.NET.SERVER_MESSAGE:
            console.log(`! Server: ${payload.data[0]}`)
            break;
        default:
            console.log(`[Error] Received unknown message type: ${payload.type}`);
    }
}

async function onErr(port) {
    console.log('We will reconnect in 3 seconds..');
    setTimeout(async () => { 
        console.log('Reconnecting..');
        await listen(port);
    }, 3000);
}

// Methods
module.exports.listen = listen;
module.exports.send = send;