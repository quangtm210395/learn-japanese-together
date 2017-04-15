const configs = require('../../configs');
const axios = require('axios');

module.exports = {
    search: function (req, res) {
        if (req.body.word) {
            axios.get('http://mazii.net/api/search/' + encodeURI(req.body.word) + '/20/1')
                .then(function(result){
                    res.json(result.data);
                })
                .catch(function(err) {
                    console.log(err);
                    res.json({status: false, message: err.message});
                });
        } else {
            res.json({status: false, message: 'Not found!'});
        }
    }
}