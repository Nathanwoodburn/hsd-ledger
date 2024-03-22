const axios = require('axios');

// Get api key from file names api_key.txt
const fs = require('fs');
const api_key = fs.readFileSync('api_key.txt', 'utf8').trim();
console.log('API Key: ', api_key);

const fetchDomains = async (account,days) => {
    const response = await axios.get(`http://x:${api_key}@127.0.0.1:12039/wallet/${account}/name?own=true`);
    // Days until expiration 
    if (days === 0) {
        return response.data.map(domain => domain.name);
    }
    response.data = response.data.filter(domain => domain.stats.daysUntilExpire <= days);    
    return response.data.map(domain => domain.name);
};

const createBatch = async (domainslist) => {
    const batch = domainslist.map(domain => ["RENEW", domain]);

    const response = await axios.post(`http://x:${api_key}@127.0.0.1:12039`, {
        method: "createbatch",
        params: [batch]
    });

    if (response.status !== 200) {
        console.error(response.data);
        process.exit(1);
    }
    console.log('Error: ', response.data.error);
    return response.data;
};

module.exports = {
    fetchDomains,
    createBatch
};

// Create public function to be called by import


    // (async () => {
    //     try {
    //         const domainslist = await fetchDomains();
    //         const batch = await createBatch(domainslist);
    //         const batchString = JSON.stringify(batch);
    //         const domainsListString = JSON.stringify(domainslist);

    //         // const command = `hsd-ledger/bin/hsd-ledger sendraw '${batchString}' ${domainsListString} --api-key ${api_key} -w ${account}`;
    //         // Use node command in hsd-ledger to send the batch to the ledger

    //         const hsdLedger = require('./hsd-ledger/bin/hsd-ledger');
    //         const sendRaw = async (batch, domainsListString, apiKey, account) => {
    //             try {
    //                 console.log('Sending batch to ledger...');
    //                 console.log('API Key: ', apiKey);
    //                 const result = await hsdLedger.main(['sendraw', batch, domainsListString, '--api-key', apiKey]);
    //         console.log(result);

    //             } catch (error) {
    //                 console.error(error);
    //             }
    //         };
    //         sendRaw(batchString, domainsListString, api_key, account);


    //         // Use child_process.exec or another suitable method to execute the command
    //     } catch (err) {
    //         console.error(err);
    //         process.exit(1);
    //     }
    // })();
