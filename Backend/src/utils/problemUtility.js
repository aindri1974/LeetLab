const axios = require('axios');


const getLanguageById = (lang) =>{
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63
    }

    return language[lang.toLowerCase()];
}

const submitBatch = async (submissions) =>{

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
        },
        headers: {
            'x-rapidapi-key': '98268a4321mshf63a470617bedd3p1a6ed9jsna62a5a7df811',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };
    
    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    
    return await fetchData();
}

const waiting = async(timer) =>{
    setTimeout(()=>{
        return 1;
    },timer);
}

const submitToken = async(resultToken) =>{
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_API_KEY,
            'x-rapidapi-host': process.env.JUDGE0_HOST_ID
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    while(true)
    {
        const result = await fetchData();
        const isResultObtained = result.submissions.every((r)=>r.status_id > 2);
    
        if(isResultObtained)
            return result.submissions;

        waiting(1000); // fetch again after 1 sec
    }
}

module.exports = {getLanguageById, submitBatch, submitToken};