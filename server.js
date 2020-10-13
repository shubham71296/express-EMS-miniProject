const mysql =require('mysql');
const con=require('./model/db');
const express =require('express');
const path =require('path');
const app=express();

const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended:true
}));

// app.use(function(req,res,next){
//  res.setHeader('Access-Controll-Allow-Origin','*');
//  next();
// });

// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store')
//   next()
// });

app.use(express.static('public'));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');



//const hbs = require('express-handlebars');
// app.engine('hbs',hbs({
// 	extname: 'hbs',
// 	defaultLayout: 'mainLayout',
// 	layoutsDir: __dirname+'/views/layouts/'
// }));
// app.set('view engine','hbs');

const emproutes = require('./routes/emproutes');



app.use('/',emproutes);


app.listen(8000,()=>{
  console.log("server started on port 8000....");
});
