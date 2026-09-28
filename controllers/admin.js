const User = require('../models/User.js');
const Query = require('../models/Query.js');
const Newsletter = require('../models/NewsLetter.js');
const config = require('../config/config.js');
const Blog = require('../models/Blog.js');
const Service = require('../models/Service.js');

const {pagination} = require('../helper/index.js');

async function getDashboardStats(req, res) {
    try {
        const startDate = req.query.startDate || "2024-06-01T11:50:40.799Z";
        const endDate = req.query.endDate || new Date().toISOString();
        const interval = {
            $gte: new Date(startDate),
            $lt: new Date(endDate)
        };
        const filter = { createdAt: interval };

        const [
            totalAppUsers,
            totalBloger,
            totalAdmin
        ] = await Promise.all([
            User.countDocuments({ ...filter }),
            User.countDocuments({ ...filter, role: "bloger" }),
            User.countDocuments({ ...filter, role: "admin" }),
        ]);

        return res.status(200).json({
            message: "Dashboard stats fetched successfully",
            data: {
                totalAppUsers,
                totalBloger,
                totalAdmin
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
}

async function getAllUsers(req, res) {
    try {
        let filter = {};

        filter.role = req.query.role || "bloger";
        if (req.query.fullName) {
            filter.fullName = new RegExp(req.query.fullName, 'i');
        }

        let limit = parseInt(req.query.limit) || config.pagination.limit;
        let page = parseInt(req.query.page) || 1;
        let skip = (page - 1) * limit;

        let users = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-password -otp");

        let countUsers = await User.countDocuments(filter);
        return res.status(200).json({
            message: "All users fetched successfully",
            data: users,
            count: countUsers
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
}
// update user
async function updateUser(req, res) {
    try {
        let userId = req.params.id;
        let user = await User({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.body.password || req.body.otp) {
            return res.status(400).json({ message: "Password and OTP can't be updated here" });
        }
        await User.findByIdAndUpdate(userId, req.body, { new: true });
        return res.status(200).json({ message: "User updated   successfully" });
    }catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
}

async function getQuery(req, res) {
    try {
        let filter = {};
        let { limit, skip } = pagination(req);

        let queries = await Query.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        let countQueries = await Query.countDocuments(filter);
        return res.status(200).json({
            message: "All queries fetched successfully",
            data: queries,
            count: countQueries
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
}

async function getNewsLetter(req, res) {
    try {
        let filter = {};
        let { limit, skip } = pagination(req);

        let newsletters = await Newsletter.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        let countNewsletters = await Newsletter.countDocuments(filter);
        return res.status(200).json({
            message: "All newsletters fetched successfully",
            data: newsletters,
            count: countNewsletters
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message,
            message: "Error in server"
        });
    }
}

async function removeQuery (req,res){
  const {id} = req.params;

  try{

    const query = await Query.findByIdAndDelete(id);
    if(!query){
      return res.status(404).json({message:"Query not found"});
    }
    return res.status(200).json({message:"Query deleted successfully",data:query});

  }catch(error){
    return res.status(500).json({error:error.message,message:"Error in server"});
  }
}

async function removeblog (req,res){
  const {id} = req.params;

  try{

    const blog = await Blog.findByIdAndDelete(id);
    if(!blog){
      return res.status(404).json({message:"Blog not found"});
    }
    return res.status(200).json({message:"Blog deleted successfully",data:blog});

  }catch(error){
    return res.status(500).json({error:error.message,message:"Error in server"});
  }
}


async function removeService (req,res){
  const {id} = req.params;

  try{

    const service = await Service.findByIdAndDelete(id);
    if(!service){
      return res.status(404).json({message:"Service not found"});
    }
    return res.status(200).json({message:"Service deleted successfully",data:service});

  }catch(error){
    return res.status(500).json({error:error.message,message:"Error in server"});
  }
}


module.exports = {
    getDashboardStats,getQuery,getNewsLetter,getAllUsers,updateUser,removeQuery,removeblog,removeService
};
