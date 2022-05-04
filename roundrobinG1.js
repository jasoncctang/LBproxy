const http = require('http');
const proxy = require('http-proxy');

const proxyServer = proxy.createProxyServer()
const targets = [
    "http://18.233.161.18:8000/",
    "http://54.210.166.161:8000/",
    "http://52.204.53.171:8000/",
    "http://44.204.61.165:8000/",
    "http://44.204.178.251:8000/",
    "http://44.203.123.156:8000/",
    "http://44.202.138.183:8000/",
    "http://54.209.192.12:8000/",
    "http://44.201.194.157:8000/",
    "http://54.157.8.226:8000/",
    "http://3.94.10.200:8000/",
    "http://44.204.83.211:8000/"
];

var i = -1

server = http.createServer((req, res) => {
    i = (i+1) % targets.length;
    // console.log("Current index is " + i)
    proxyServer.web(req, res, {target: targets[i]});
})

server.listen(3000, () => {
    console.log('Proxy server running on port 3000')
});