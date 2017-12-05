function Database(db) {
    this.db = db;
};
/*Database.prototype.findwithfield = function(table, filter,field) {
    var cursor = this.db.Store(table).find(filter).project(field);
    return cursor.toArray();
};
module.exports = Database;
*/