const con = require('../shared/connections');
const client = require('./module/client');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Message: ',
    terminal: false
});

rl.on('line', (line) => {
    client.send(line.trim(), con.NET.PUBLIC_MESSAGE);
    rl.prompt();
});

var config = {
    port: 5555
};

async function startup() {
    await client.listen(config.port);
    
    // If we set up the prompt too early then it gets put before
    // the startup messages
    setTimeout(() => {
        rl.prompt();
    }, 1000);
}

startup();
