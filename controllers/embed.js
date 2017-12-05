module.exports = function(app,hbs){

	app.use('/appShopify.js',function(req,res){
		hbs.renderView(__dirname+'/../views/user/feek.hbs',{},function(err,str){
			if (err){
				res.json(err);
			}else{
				res.setHeader('Content-Type','application/x-javascript');
				res.send(str);
			}
		});
	});

};