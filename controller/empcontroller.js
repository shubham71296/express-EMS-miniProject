const mysql     = require('mysql');
const con       = require('../model/db');
const path      = require('path');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const { body, validationResult, matchedData } = require('express-validator');
const multer    = require('multer');



if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}



const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/upload/')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage }).single('profilepic');



exports.validate = (method) => {
switch (method) {
    case 'loginsubmit': {
     return [ 
        body('email', 'email can not be empty').not().isEmpty(),
        body('pwd', 'password must be required').not().isEmpty()
       ]   
    }
  }
}


module.exports.emslogin = (req,res)=>{
  res.render('login');
}



module.exports.loginsubmit = (req,res)=>{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     console.log(errors.mapped());
     const user = matchedData(req);
     console.log(user);
      res.render('login',{ errors: errors.mapped(),user:user });
    }
    else{   
       var email = req.body.email;
       var password = req.body.pwd;
          var sql = 'select * from emstable where email = ?'
            con.query(sql,email,(err,result)=>{
              if(err) throw err;
              else if(result.length>0){
                bcrypt.compare(password,result[0].password,function(err,result1){
                  if(err) throw err;
                  else if(result1){
                    console.log(result);
                    console.log(result1); //here result1 return true or false
                     console.log(result[0].email);
                       jwt.sign({email:result[0].email,name:result[0].name,userId:result[0].id},'secretkey',(err,token)=>{
                        if(err) throw err;
                        else{
                          localStorage.setItem('myToken',token);  
                          console.log(token);
                          res.render('home',{username:result[0].name});
                        }
                      })  
                  }
                  else
                    res.send('login failed password cant match!!!');
                })
              }

               else
                 res.render('login',{msg:"login failed !!!"});
            })
    }
}



module.exports.empsignup = (req,res)=>{
  res.render('signup',{username:req.authData.name});
}



module.exports.signupsubmit = (req,res)=>{
 upload(req,res,(err)=>{
   if(err) throw err;
   if(req.file){
     console.log(req.file);
     console.log(req.file.filename);
      var name = req.body.name;
      var email = req.body.email;
      var salary = req.body.salary;
      var password = req.body.pwd;
      var profilepic = req.file.filename;
         
         var sql = 'select * from emstable where email=?';
         con.query(sql,email,(err,result)=>{
          if(err) throw err;
          else if(result.length>0){
            res.render('signup',{msg:"email already exist!!!"});
          }
          else{
            bcrypt.hash(password,10,function(err,hash){
              if(err) throw err;
              else{
                var sql = 'insert into emstable(name,email,salary,password,profilepic)values(?,?,?,?,?)';
                var data = [name,email,salary,hash,profilepic];
                con.query(sql,data,(err)=>{
                  if(err) throw err;
                  else{
                    res.render('signup',{msg:"successfully data inserted..",username:req.authData.name});
                  }              
                })
              }
            })
          }
         })
   }
   else
    res.send('cant upload image');
 })
}


module.exports.viewemp = (req,res)=>{
  var sql = 'select id,name,email,salary,profilepic from emstable';
      con.query(sql,(err,result)=>{
        if(err) throw err;
         else if(result.length>0){
           //console.log(result);
           res.render('view',{data:result,username:req.authData.name});
         }
         else
           res.send('cant find records');
      })
}


module.exports.deleteemp = (req,res)=>{
 var id = req.query.eid;
 var sql = 'delete from emstable where id = '+id;
   con.query(sql,(err)=>{
    if(err) throw err;
    else{
      var sql = 'select id,name,email,salary,profilepic from emstable';
      con.query(sql,(err,result)=>{
        if(err) throw err;
         else if(result.length>0){
           res.render('view',{data:result,msg:"data deleted",username:req.authData.name});
         }
         else
           res.send('cant find records');
      })
      }
   })
}


module.exports.updateselect = (req,res)=>{
 var id = req.query.eid;
 var sql = 'select * from emstable where id='+id;
   con.query(sql,(err,result)=>{
    if(err) throw err;
     else if(result.length>0){
      console.log(result[0]);
        res.render('update',{data:result[0],username:req.authData.name});
      }
      else
        res.send('cant find records');
   })
}


module.exports.updatedata = (req,res)=>{
   upload(req,res,(err)=>{
    if(err) throw err;
    if(req.file){
       var id = req.body.empid;
       var name = req.body.name;
       var email = req.body.email;
       var salary = req.body.salary;
       var profilepic = req.file.filename;
       var data = [name,email,salary,profilepic];
       var sql = 'update emstable set name=?,email=?,salary=?,profilepic=? where id='+id;
         con.query(sql,data,(err)=>{
          if(err) throw err;
          else{
            var sql = 'select id,name,email,salary,profilepic from emstable';
              con.query(sql,(err,result)=>{
                if(err) throw err;
                 else if(result.length>0){
                   res.render('view',{data:result,msg:"data updated",username:req.authData.name});
                 }
                 else
                   res.send('cant find records');
              })
          }
         })
    }
        else{ 
         var id = req.body.empid;
         var name = req.body.name;
         var email = req.body.email;
         var salary = req.body.salary;
         var data = [name,email,salary];
         var sql = 'update emstable set name=?,email=?,salary=? where id='+id;
           con.query(sql,data,(err)=>{
            if(err) throw err;
            else{
              var sql = 'select id,name,email,salary,profilepic from emstable';
                con.query(sql,(err,result)=>{
                  if(err) throw err;
                   else if(result.length>0){
                     res.render('view',{data:result,msg:"data updated",username:req.authData.name});
                   }
                   else
                     res.send('cant find records');
                })
            }
           })
        }
   })
}


// module.exports.updatedata = (req,res)=>{
//    upload(req,res,(err)=>{
//     if(err) throw err;
//     if(req.file){
//        var id = req.body.empid;
//        var name = req.body.name;
//        var email = req.body.email;
//        var salary = req.body.salary;
//        var profilepic = req.file.filename;
//        var data = [name,email,salary,profilepic];
//        var sql = 'update emstable set name=?,email=?,salary=?,profilepic=? where id='+id;
//          con.query(sql,data,(err)=>{
//           if(err) throw err;
//           else{
//             var sql = 'select id,name,email,salary,profilepic from emstable';
//               con.query(sql,(err,result)=>{
//                 if(err) throw err;
//                  else if(result.length>0){
//                    res.render('view',{data:result,msg:"data updated",username:req.authData.name});
//                  }
//                  else
//                    res.send('cant find records');
//               })
//           }
//          })
//     }
//        else{
//         res.send("cant upload file");
//        }
//    })
// }




module.exports.logout = (req,res)=>{
  localStorage.removeItem('myToken');
  res.render('login');
}
   