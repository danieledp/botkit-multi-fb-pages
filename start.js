var { spawn } = require('child_process');

var bucket = spawn('nodejs', ['./webhook.js'], {
    stdio: 'inherit',
    cwd: __dirname
});

var pool = spawn('nodejs', ['./bots-pool.js'], {
    stdio: 'inherit',
    cwd: __dirname
});
