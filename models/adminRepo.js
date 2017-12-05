var mustache = require('mustache'),
    db = require('../fn/db');

exports.loadAll = function() {
    var sql = `select * from comments`;
    return db.load(sql);
}
/*exports.insert = function(entity) {
    var sql = mustache.render(
        `insert into comments(Email, Status, Comment) values("{{email}}", {{status}}, {{comment}})`,
        entity
    );

    return db.insert(sql);
}*/