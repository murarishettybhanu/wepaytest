const User = require("../database/models/User")
module.exports = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user.memberstatus == "active") {
        await User.findByIdAndUpdate(req.params.id, {
            memberstatus: "inactive"
        })
        res.redirect("/auth/distubitors");
    }
    if (user.memberstatus == "inactive") {
        await User.findByIdAndUpdate(req.params.id, {
            memberstatus: "active"
        })
        res.redirect("/auth/distubitors");
    }
}