const env = require('node-env-file')(__dirname + '/.env'),
      request = require('request'),
      express = require('express'),
      bodyParser = require('body-parser');

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const FB_WEBHOOK_PORT = process.env.FB_WEBHOOK_PORT;
const POOL_PORT = process.env.POOL_PORT || 3000;

const http = express();
http.use(bodyParser.json());

http.get('/', function(req, res) {
   res.end();
});

http.get('/buckets', function(req, res) {
    res.end();
});

http.get('/buckets/facebook', function(req, res) {
    /*
     * This is what we'll get from facebook in the subscription request:
     * https://my.url?hub.mode=subscribe&hub.challenge=123456789&hub.verify_token=XXXXXXXXXX
     */

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === FB_VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

http.post('/buckets/facebook', function(req, res) {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {
            let pageID = entry.id;
            
            request({
                url: 'http://localhost:' + POOL_PORT + '/facebook/' + pageID + '/receive',
                method: 'POST',
                body: body,
                json: true
            }, function(err, res, body) {
                console.log('Payload sent to Bot! pageID: ' + pageID);
            });

            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            if (entry.messaging) {
                let webhook_event = entry.messaging[0];
            }            
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

http.use(function(req, res, next) {
    res.status(404).send("Sorry can't find that!");
})

http.listen(FB_WEBHOOK_PORT, '127.0.0.1', function() {
    console.log("Listening at 127.0.0.1:" + FB_WEBHOOK_PORT);
});
