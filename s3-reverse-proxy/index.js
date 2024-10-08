const express = require("express")
const httpProxy = require('http-proxy')

const app = express();
const PORT = process.env.PORT || 8000

const BASE_PATH = ''

const proxy = httpProxy.createProxy()

app.use((req, res)=>{
    const hostName = req.hostname;
    const subdomain = hostName.split('.')[0]

    const resolvesTo = `${BASE_PATH}/${subdomain}`;

    return proxy.web(req, res, {target: resolvesTo, changeOrigin: true})
})

proxy.on('proxyReq', (proxyReq, req, res)=>{
    const url = req.url;
    if(url == '/') {
        proxyReq.path += 'index.html';
    }
    return proxyReq;
})

app.listen(PORT, ()=>console.log(`Reverse Proxy Running at port-${PORT}`));