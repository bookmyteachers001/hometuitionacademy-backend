function authoriseAdmin(req, res, next) {
    let role = req.user.role;
    if (role == "admin"){
        next();
    }else {
        return res.status(403).json({ message: "Insufficient permissions Your role no access to these api" });
    } 
}

module.exports = { authoriseAdmin };
