var express = require('express'),
    userRepo = require('../models/userRepo');
    
var r = express.Router();

 r.get('/', function(req, res) {
 
      userRepo.loadAll()
         .then(function(rows) {
            var vm = {
                layout: false,
                comments: rows
             };
             //res.render('user/feedback', vm);
             res.render('user/feedback', vm);
         }).fail(function(err) {
             console.log(err);
             res.end('fail');
         });

 });

r.post('/', function(req, res) {
    userRepo.insert(req.body).then(function(data) {
        var vm = {
            layout: false,
        };
        console.log(data);
        res.json(req.body);
        // res.redirect('/company');
    });
});

module.exports = r;