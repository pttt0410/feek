var mustache = require('mustache'),
    db = require('../fn/db');

exports.loadAll = function() {
    var sql = `select * from comments`;
    return db.load(sql);
}
