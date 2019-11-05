const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const session = require('express-session');
const ejs=require('ejs');
const obj=express();

obj.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
obj.use(bodyParser.urlencoded({extended : true}));
obj.use(bodyParser.json());

obj.set('view engine','ejs');

var urlEncodedParser=bodyParser.urlencoded({extended:false});

obj.use('/styling',express.static('style'))

obj.get('/home',(req,res)=>{
    res.render('home');
})
obj.get('/login',(req,res)=>{
    res.render('login');
})

obj.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM hotel_employee WHERE Username = ? AND Password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.render('hotelEmpHome');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Registration'
  })
  
  connection.connect(function(err){
      if(err) throw err;

      console.log('Database Connected');
  })
  
obj.get('/all',(req,res)=>{
    var sql="select * from hotel_employee";
    connection.query(sql,function(err,results){
        if(err) throw err;
        console.log(results);
        res.render('all',{item:results});
    })
})

obj.get('/hotels',(req,res)=>{
    res.render('Hotels',{qs:req.query});
})
obj.post('/hotels',urlEncodedParser,(req,res)=>{
    console.log(req.body);

    var sql="insert into Hotels values('"+req.body.name+"','"+req.body.price+"','"+req.body.discount+"','"+req.body.address+"')"; 
    connection.query(sql,function(err){
        if(err) throw err;
        console.log('data inserted');
        res.render('hotelEmpHome');
    })
})    

obj.get('/register',(req,res)=>{
    console.log(req.query)
    res.render('register',{qs:req.query});
})
obj.post('/register',urlEncodedParser,(req,res)=>{
    console.log(req.body);

    var sql="insert into Hotel_Employee values('"+req.body.name+"','"+req.body.email+"','"+req.body.username+"','"+req.body.password+"','"+req.body.hname+"','"+req.body.address+"','"+req.body.phone+"','"+req.body.BankName+"','"+req.body.ACnum+"')"; 
    connection.query(sql,function(err){
        if(err) throw err;
        console.log('data inserted');
        res.redirect('/home');
    })
    
   // res.render('register');
})
obj.get('/*',(req,res)=>{
    res.send('Unknown Url');
})

obj.listen(3000,()=>{
    console.log('Nodejs is running in port 3000');
})

