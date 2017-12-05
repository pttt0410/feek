var express = require('express'),
  exphbs = require('express-handlebars'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  path = require('path'),
  moment = require('moment'),
  dateformat = require('dateformat'),
  session = require('express-session'),
  appShopify = require('./controllers/appShopify'),
  http = require('http'),
  cors = require('cors'),
  //  https = require ('https'),
  adminController = require('./controllers/adminController'),
  userController = require('./controllers/userController');
  fbController = require('./controllers/fbController');
const app = express();

const https = require('https');
//const server = http.createServer(service);
app.use(morgan('dev'));
app.use(cors());
//app.set('view engine', 'ejs');
var server = http.createServer(app);
var hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: 'views/_layouts/',
  partialsDir: 'views/_partials/',
  helpers: {}
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.static(
  path.resolve(__dirname, 'public')
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


app.use('/', appShopify);
app.use('/admin', adminController);
app.use('/user', userController);
app.use('/fb', fbController);

server.listen(3000, function() {

  console.log("Server is running on port 3000.");
});