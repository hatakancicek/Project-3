const axios = require('axios');
const initStorage = require('./initStorage');

const masterUrl = "http://127.0.0.1:3000";

axios.get(masterUrl)
    .then(initStorage)
    .catch(console.error);
