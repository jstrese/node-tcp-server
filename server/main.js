const net = require('net');
const con = require('../shared/connections');

var config = {
    port: 5555,
    motd: 'Welcome to the server!'
};

var clientPool = [];

async function onData(data, conn) {
    let payload = con.parse(data);

    switch(payload.type) {
        case con.NET.PINGPONG:
            // TODO: Handle pong and lack of pong
            break;
        case con.NET.PRIVATE_MESSAGE:
            // TODO: Deliver private message to only the intended recipient
            break;
        case con.NET.PUBLIC_MESSAGE:
            // Public messages get re-broadcast to all connected
            // clients except the sender
            clientPool.forEach(c => {
                if(c !== conn)
                    con.send(c, payload.data[0], con.NET.PUBLIC_MESSAGE);
            });
            break;
        case con.NET.SERVER_MESSAGE:
            break;
        default:
            console.log(`[Error] Received unknown message type ${payload.type}`);
    }
}

// Send a 'ping' to all connected clients every three seconds
async function ping() {
    let x, y = clientPool.length;
    while(x < y) {
        con.send(clientPool[x], 'ping', con.NET.PINGPONG);
        ++x;
    }

    setTimeout(() => { ping() }, 3000);
}

let server = net.createServer(async (conn) => {
    clientPool.push(conn);

    console.log(`Client connected! (total: ${clientPool.length})`);

    con.send(conn, config.motd, con.NET.SERVER_MESSAGE);

    conn.on('error', (err) => {
        let x, y = clientPool.length;

        while(x < y) {
            if(c === conn) {
                clientPool.splice(x, 1);
            }
            ++x;
        }

        console.log(`Client disconnected! (total: ${clientPool.length})`);
    });

    conn.on('data', (data) => {
        onData(data, conn);
    });

    conn.on('end', () => {
        console.log('Client disconnected');
    });
});

ping();

server.on('error', (err) => {
    console.log(`Server emitted error: ${err.message}`);
});

server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
});