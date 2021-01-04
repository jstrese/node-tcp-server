// Types of messages
const NET = {
    SERVER_MESSAGE: '.SRVMSG',
    PINGPONG: '.PNG',
    PUBLIC_MESSAGE: '.PUBMSG',
    PRIVATE_MESSAGE: '.PRIVMSG'
}

async function send(client, data, type = con.NET.SERVER_MESSAGE) {
    try {
        client.write(format(data, type));
    } catch (ex) {
        console.log(`Error: ${ex.message}`);
    }
}

function format(message, type = NET.SERVER_MESSAGE) {
    // The type of message will always be the first item
    let out = dataFormat(type);

    if(Array.isArray(message)) {
        message.forEach((m) => {
            out += dataFormat(m);
        });
    } else {
        out += dataFormat(message);
    }

    return out;
}

function dataFormat(m) {
    let length;

    // Support up to 999 characters per message block
    // If > 999 then truncate the text down to 996 characters
    // and add '...' at the end to indicate it was truncated
    if(m.length > 999) {
        m = `${m.slice(0, 996)}...`;
    }

    if(m.length < 100) {
        if(m.length < 10) {
            length = `00${m.length}`;
        } else {
            length = `0${m.length}`;
        }
    } else {
        length = m.length;
    }

    return `${length}${m}`;
}

function validType(type) {
    return Object.values(NET).includes(type);
}

function parse(data) {
    data = String(data);

    let reading = true;
    let curPos = 0;
    let inputs = [];
    let type = null;

    // Data format
    // Each message is prefixed with a type with data following it
    // [LEN][TYPE][LEN][DATA]
    // Example: 04.PNG04ping
    // This would be a NET.PINGPONG message with 'ping' as a payload
    // 04 is the length of .PNG and 'ping'
    if(data.length > 2) {
        // Get the type of message sent
        let lengthDigits = 3;
        let length = Number(data.substring(curPos, curPos + lengthDigits));
        type = data.substring(curPos + lengthDigits, curPos + length + lengthDigits);
        curPos += length + lengthDigits;

        if(validType(type)) {
            while(reading) {
                let length = Number(data.substring(curPos, curPos + lengthDigits));
                let message = data.substring(curPos + lengthDigits, curPos + length + lengthDigits);
                inputs.push(message);
                curPos += length + lengthDigits;
                reading = curPos !== data.length;
            }
        }
    }

    return {
        type: type,
        data: inputs
    };
}

// Methods
module.exports.parse = parse;
module.exports.format = format;
module.exports.send = send;

// Constants
module.exports.NET = NET;