const fs = require('fs');
const axios = require('axios');

const hostUrl = "http://127.0.0.1:3000";

const method = process.argv[2];
const path = process.argv[3];
const flag = process.argv[4] === "-f";

switch(method) {
    case "getAttr":
        axios.post(hostUrl, {
            method,
            path,
        }).then(resp => {
            const data = resp.data;
            if(flag)
                fs.writeFileSync(process.argv[5], JSON.stringify(data));
            else 
                console.log(data);
        }).catch(resp => console.error(resp.response.data.error))

        break;

    case "write":
        let data = process.argv[4];
        if(flag)
            data = fs.readFileSync(process.argv[5]);

        axios.post(hostUrl, {
            method,
            path,
            data: JSON.stringify({data: data}),
        }).then(resp => {
            const data = resp.data;
            console.log(data);
        }).catch(resp => console.error(resp.response.data.error))

        break;

    case "read":
        axios.post(hostUrl, {
            method,
            path,
        }).then(resp => {
            let _flag = false;
            let data = resp.data;
            if(resp.data.data)
                {
                    data =  Buffer.from(resp.data.data)
                    _flag = true;
                }
            if(flag)
                fs.writeFileSync(process.argv[5],data);
            else 
                console.log(_flag ? data.toString('utf-8'): data);
        }).catch(resp => console.error(resp.response.data.error))

        break;

    case "delete":
        axios.post(hostUrl, {
            method,
            path,
        }).then(resp => {
            console.log(resp.data);
        }).catch(resp => console.error(resp.response.data.error))

        break;
}