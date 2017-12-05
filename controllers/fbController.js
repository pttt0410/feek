var express = require('express'),
    adminRepo = require('../models/fbRepo');
    
var r = express.Router();

r.get('/', function(req, res) {
 
     adminRepo.loadAll()
        .then(function(rows) {
            var vm = {
                layout: false,
                comments: rows
            };
            res.render('user/comments', vm);
        
        }).fail(function(err) {
            console.log(err);
            res.end('fail');
        });

});


module.exports = r;