const appconst = require('./misc/constants.js');

module.exports = function (app) {
    app.get('/version', function(req, res) {
        res.status(200).json("");
    });
}