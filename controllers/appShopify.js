var express = require('express');

var db = require('../models/userRepo'),
    express = require('express'),
    session = require('express-session'),
    assert = require('assert'),
    exphbs = require('express-handlebars'),
    shopify = require('shopify-node-api');

var MySQLStore = require('express-mysql-session')(session);
const Shopify = require('shopify-api-node');
var r = express.Router();
var bodyParser = require('body-parser');
var token = require('../config/token');
var API_KEY = token.API_KEY;
var API_SECRET = token.API_SECRET;
//var Databases = require('../models/app');
//var Database = new Databases(db);
var store = {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'feek',
        createDatabaseTable: true,
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    };
var Store = new MySQLStore(store);
    // Catch errors
    Store.on('error', function(error) {
        assert.ifError(error);
        assert.ok(false);
    });
    r.use(bodyParser.urlencoded({ extended: true }));
    r.use(bodyParser.json());
    r.use(require('express-session')({
        secret: 'ptttrang562',
        // cookie: {
        //     maxAge: 10000 * 60
        // },
        store: Store,
        resave: true,
        saveUninitialized: true
    }));


var config = {
  verbose: false,
  shop: '',
  shopify_api_key: API_KEY, // Your API key
  shopify_shared_secret: API_SECRET, //Your shared secret
  shopify_scope: 'read_products,read_script_tags,write_script_tags',
  redirect_uri: 'http://localhost:3000/auth',
  nonce: 'thuytrang',  //you must provide a randomly selected value unique for each authorization request
};

r.get('/install', function(req,res){
  req.session.config = {
    verbose: false,
    shop:'', //myshop.myshopify.com
    shopify_api_key: API_KEY,
    shopify_shared_secret: API_SECRET,
    access_token: '', //permanent token
  };
  config.shop = req.query.shop;
  req.session.config.shop = req.query.shop;
  var shopNode = new shopify(config);
  var auth_url = shopNode.buildAuthURL();
  //console.log(auth_url);
  res.redirect(auth_url);

});

r.get('/auth', function(req, res) {
        var shopNode = new shopify(config); // You need to pass in your config here
        var query_params = req.query;
        shopNode.exchange_temporary_token(query_params, function(err, data) {
            if (err) res.send(err)
            else {
                console.log(data);
                req.session.config.access_token = data.access_token;
                shopNode = new shopify(req.session.config);
                shopNode.get('/admin/shop.json', function(err, data) {
                    if (err) res.send(err);
                    else {

                        req.session.name = data.shop.name;
                        console.log(req.session.config);
                        shopNode.get('/admin/webhooks/count.json?address=https://24eecb63.ngrok.io//uninstall/', function(err, count) {
                            if (err) {
                                console.log('WEBHOOK: ' + error);
                            } else {
                                console.log(count);
                                if (count.count < 1) {
                                    var webhook_post = {
                                        'webhook': {
                                            "topic": "app\/uninstalled",
                                            "address": "https://24eecb63.ngrok.io/uninstall/",
                                            "format": "json"
                                        }
                                    }
                                    console.log(webhook_post);
                                    shopNode.post('/admin/webhooks.json', webhook_post, function(error, result) {
                                        if (error)
                                            console.log(error);
                                        else {
                                            console.log(result);
                                            addScript(req.session.config, function() {
                                                res.redirect('/admin');
                                            });
                                        }
                                    });
                                } else {
                                    res.redirect('/admin');
                                }
                            }

                        });

                    }
                });
            }
        });
    });
var addScript = function(config, callback) {
        var post_data = {
            "script_tag": {
                "event": "onload",
                "src": "https:\/\/24eecb63.ngrok.io\/appShopify.js",
                "display_scope": "online_store"
            }
        }
        console.log(post_data.script_tag.src);
        var shopNode = new shopify(config);
        shopNode.get('/admin/script_tags.json?src=' + post_data.script_tag.src, function(error, data) {
            if (error) console.log("SRIPT TAG: " + error)
            else {
                if (data.script_tags.length == 0) {
                    shopNode.post('/admin/script_tags.json', post_data, function(error, data) {
                        if (error) {
                            console.log("POST SCRIPT ERROR");
                            console.log(error);
                        } else {
                            console.log('POSTED SCRIPT TAG');
                            console.log(data);
                            callback();
                        };
                    });
                } else callback();
            }
        })

    };
   // userRepo = require('../models/userRepo');
    r.get('/', function(req, res) {
    var shopNode = new shopify(req.session.config);
    //console.log(shopNode);
      res.render('user/feedback', {name: req.session.name });
    });
    r.get('/appShopify.js', function(req, res){
        const hbs = exphbs.create({});
        hbs.renderView(__dirname+'/../views/user/feek.hbs',{},function(err,str){
            if (err){
                res.json(err);
            }else{
                res.setHeader('Content-Type','application/x-javascript');
                res.send(str);
            }
        });
       
    });
     r.get('/test', function(req, res) {
        res.render('user/test', { name: req.session.name });
    });
    //  r.get('/comment', function(req, res) {
    //     res.render('user/comment', { name: req.session.name });
    // });
 // app.get('/product', function(req, res) {
 //        var shopNode = new shopify(req.session.config);
 //        shopNode.get('/admin/products.json?fields=title,image,id,variants', function(err, data) {
 //            // if (err) res.send(err);
 //            // else {
 //            //     Database.findwithfield("shop", { 'name': { $ne: req.session.name } }, { '_id': 0 })
 //            //         .then(
 //            //             (result) => res.render('product', { name: req.session.name, productList: data.products, shopList: result }),
 //            //             (error) => res.send(error));
 //            // };
 //            res.render('user/product', {name: req.session.name,productList: data.products});
 //        });
 //    });
module.exports = r;
//}