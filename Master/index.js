const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");

const key = "CP SUCKS"

let storageIndex = 0;
const baseStorageUrl = "http://127.0.0.1:";
const basePort = 5000;
const port = 3000;

let rrIndex = 0;
// parse application/json
app.use(bodyParser.json({limit: '1000mb', extended: true}));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.status(200).send({
        id: storageIndex++,
    });
});

// respond with "hello world" when a GET request is made to the homepage
app.post('/', function (req, res) {
    const { method, path, data } = req.body;

    _data = AES.encrypt(data, key).toString();

    console.log(method)

    try {
        switch(method) {
            case "write":
                Promise.all(Array.from(Array(storageIndex).keys())
                    .map(index => axios.post(baseStorageUrl + (basePort + index), { 
                        method, 
                        path, 
                        data: _data, 
                    })))
                .then((resps) =>
                    res.status(resps[0].data.status 
                        ? 200 
                        : 500)
                    .send(resps[0].data.status && "success"
                        || resps[0].data.error))
                break;
    
            case "read":
                axios.post(baseStorageUrl + (basePort + (rrIndex++ % storageIndex)), { 
                    method, 
                    path, 
                }).then(({data: { status, data, error, flag }}) =>{
                    if(!status) {
                        Promise.all(Array.from(Array(storageIndex).keys())
                            .map(index => axios.post(baseStorageUrl + (basePort + index), { 
                                method: "read", 
                                path, 
                        })))
                        .then(resps => {
                            const _reps = resps.map(({
                                data: {
                                    status,
                                    data,
                                    flag,
                                }
                            }) => ({
                                status,
                                data,
                                flag,
                            }));

                            const success = _reps.filter(({status}) => status);
                            if(success.length)
                                Promise.all(Array.from(Array(storageIndex).keys())
                                .map(index => axios.post(baseStorageUrl + (basePort + index), { 
                                    method: "write", 
                                    path, 
                                    data: success[0].data, 
                                })))
                                .then(_ => res.status(200).send(
                                    flag
                                    ? JSON.stringify(success[0].data)
                                    : AES.decrypt(success[0].data, key).toString(CryptoJS.enc.Utf8)))

                            else 
                                res.status(500)
                                    .send(error)
                        })
                    }
                    else {
                        res.status(200).send(
                            flag
                            ? JSON.stringify(data)
                            : AES.decrypt(data, key).toString(CryptoJS.enc.Utf8))
                    }
                });
                break;
    
            case "getAttr":
                axios.post(baseStorageUrl + (basePort + (rrIndex++ % storageIndex)), { 
                    method, 
                    path, 
                    data, 
                }).then(resp =>
                res.status(resp.data.status 
                    ? 200 
                    : 500)
                .send(resp.data.data 
                    || resp.data.error))
                break;
    
            case "delete":
                Promise.all(Array.from(Array(storageIndex).keys())
                .map(index => axios.post(baseStorageUrl + (basePort + index), { 
                    method, 
                    path, 
                })))
                .then((resps) =>
                    res.status(resps[0].data.status 
                        ? 200 
                        : 500)
                    .send(resps[0].data.status && "success"
                        || resps[0].data.error))     

                break;

            default:
                return res.status(404).send({
                    status: false,
                    error: "Unknown operation"
                })
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            error: err.toString(),
        });
    }
});

app.listen(port, () => console.log(`Master listening on port ${port}!`))