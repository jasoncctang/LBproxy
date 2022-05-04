const http = require('http');
const proxy = require('http-proxy');

const proxyServer = proxy.createProxyServer()
const targets = [
    "http://52.90.83.235:8000/",
    "http://18.208.180.237:8000/",
    "http://54.197.21.48:8000/",
    "http://44.202.102.250:8000/",
    "http://44.202.82.37:8000/",
    "http://3.82.125.158:8000/",
    "http://3.92.178.80:8000/",
    "http://54.89.183.168:8000/",
    "http://18.212.168.69:8000/",
    "http://18.212.177.139:8000/",
    "http://52.90.114.26:8000/",
    "http://184.72.193.108:8000/"
];
// const targets = [
//     'http://localhost:8000',
//     'http://localhost:8001'
// ]

// RandomLB target index: Math.floor(Math.random()*3)

http.createServer((req, res) => {
    let i = Math.floor(Math.random()*targets.length);
    proxyServer.web(req, res, {target: targets[i]});
}).listen(3000, () => {
    console.log('Proxy server running on port 3000')
});