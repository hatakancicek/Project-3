const express = require('express');
const app = express();
const f = require('./Functions');
const bodyParser = require('body-parser');

// parse application/json
app.use(bodyParser.json({limit: '1000mb', extended: true}))

// respond with "hello world" when a GET request is made to the homepage
app.post('/', function (req, res) {
    const { method, path, data } = req.body;

    console.log(method)

    try {
        let resp;
        let flag;

        switch(method) {
            case "write":
                resp = f.Write({ path, data });
                break;
    
            case "read":
                const _resp = f.Read({ path, });
                if(_resp.isDir) flag = true;
                    resp = _resp.data;
                break;
    
            case "getAttr":
                resp = f.GetAttr({ path, });
                break;
    
            case "delete":
                resp = f.Delete({ path, });
                break;

            default:
                return res.status(200).send({
                    status: false,
                    error: "Unknown operation"
                })
        }

        res.status(200).send({
            status: true,
            data: resp,
            flag,
        });
    } catch (err) {
        res.status(200).send({
            status: false,
            error: err.toString(),
        });
    }
});

module.exports = app;

