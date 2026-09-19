const Query = require('../models/Query');
const Newsletter = require('../models/NewsLetter'); 


async function createQuery(req, res){
    try {
        let requestData = req.body;
        let newQuery = new Query(requestData);
        await newQuery.save();
        return res.status(200).json({ message: "Query created successfully", data: newQuery });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
}

async function createNewsletter(req, res){
    try {
        let requestData = req.body;
        let newNewsletter = new Newsletter(requestData);
        await newNewsletter.save();
        return res.status(200).json({ message: "Newsletter created successfully", data: newNewsletter });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
}



module.exports = {
    createQuery,
    createNewsletter
}