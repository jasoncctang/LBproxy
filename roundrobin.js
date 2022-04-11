const http = require('http');
const proxy = require('http-proxy');

const proxyServer = proxy.createProxyServer()
const targets = [
    'http://ec2-44-203-194-237.compute-1.amazonaws.com:8000',
    'http://ec2-54-90-103-139.compute-1.amazonaws.com:8000',
    'http://ec2-54-159-207-166.compute-1.amazonaws.com:8000',
    'http://ec2-3-85-129-7.compute-1.amazonaws.com:8000',
    'http://ec2-54-144-64-83.compute-1.amazonaws.com:8000'
];
// const targets = [
//     'http://localhost:8000',
//     'http://localhost:8001'
// ]

var i = -1

server = http.createServer((req, res) => {
    i = (i+1) % targets.length;
    console.log("Current index is " + i)
    proxyServer.web(req, res, {target: targets[i]});
})

server.listen(3000, () => {
    console.log('Proxy server running on port 3000')
});
