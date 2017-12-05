var express = require('express'),
    adminRepo = require('../models/adminRepo');
    
var r = express.Router();

r.get('/', function(req, res) {
 
     adminRepo.loadAll()
        .then(function(rows) {
            var vm = {
                layout: false,
                comments: rows
            };
            res.render('admin/home', vm);
        
        }).fail(function(err) {
            console.log(err);
            res.end('fail');
        });

});
r.get('/thongke', function(req, res){
    adminRepo.loadAll()
        .then(function(rows) {
            var vm = {
                layout: false,
                comments: rows
            };
            res.render('admin/feek', vm);
        
        }).fail(function(err) {
            console.log(err);
            res.end('fail');
        });
});
module.exports = r;