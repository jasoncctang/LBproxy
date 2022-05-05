// Video stream load balancer with decision based loosely
// on UCB1 reinforcement learning algorithm with
// video server response time as the metric.
// Every iteration has a guaranteed minimum level of exploration (hard)

const http = require('http');
const proxy = require('http-proxy');

const targets = [
    "http://54.89.80.195:8000/",
    "http://52.91.82.14:8000/",
    "http://3.91.238.245:8000/",
    "http://54.87.171.219:8000/",
    "http://54.162.20.161:8000/",
    "http://54.198.43.132:8000/",
    "http://3.84.174.9:8000/",
    "http://54.166.250.121:8000/",
    "http://54.85.9.143:8000/",
    "http://18.215.229.172:8000/",
    "http://34.201.215.175:8000/",
    "http://3.90.48.76:8000/"
];

let choicecount = 6, initial_explore = 3;

if(choicecount > targets.length - 1){
    choicecount = targets.length - 1;
}

let target_times = [], avg_times = [], initialize = true;
let time_count = 0, maxcount = initial_explore * targets.length;
let i = -1, minInd = 0; // current target index
let choosable = new Set(), chosens = [];

for(let j = 0; j < targets.length; j++){
    target_times.push([]);
    avg_times.push(0)
}

const proxyServer = proxy.createProxyServer();
proxyServer.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader('start-time', Date.now());
});

proxyServer.on('proxyRes', function (proxyRes, req, res) {
    rtime = Number(proxyRes.headers['response-time'])
    if(!rtime) return;
    target_times[i].push(rtime);

    if(initialize){
        // console.log("initialize step")
        time_count += 1;
        avg_times[i] += rtime

        if(time_count >= maxcount){
            initialize = false;
            for(let j = 0; j < avg_times.length; j++){
                avg_times[j] /= initial_explore;

                if(j < choicecount) choosable.add(j);
                else chosens.push(j);
            }
        }
    } else {
        oldtime = target_times[i].shift();
        avg_times[i] += (rtime - oldtime) / initial_explore;
        
        choosable.delete(i);
        chosens.push(i);
        choosable.add(chosens.shift());

        minInd = -1;
        for(let index of choosable){
            if(minInd == -1){
                minInd = index; 
            }else if(avg_times[index] < avg_times[minInd]){
                minInd = index;
            }
        }
    }
    // console.log(`Target index ${i} (${targets[i]}) had a response time of ${avg_times[i]} ms`);
});


http.createServer((req, res) => {
    if(initialize){
        i = (i + 1) % targets.length;
    } else {
        i = minInd;
        // console.log(`choices are ${choosable} and chosen is ${i}`);
    }

    proxyServer.web(req, res, {target: targets[i]});
}).listen(3000, () => {
    console.log('Proxy server running on port 3000');
});