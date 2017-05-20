/**
 * Created by phanmduong on 5/17/17.
 */
module.exports = {

    videocall: function (req, res) {
        res.render('videocall.ejs', {peer_id: req.query.peer_id});
    }
}