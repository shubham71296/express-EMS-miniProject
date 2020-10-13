const jwt = require('jsonwebtoken');



module.exports.verify = (req, res, next)=>{
    
    const token = localStorage.getItem('myToken');

    jwt.verify(token, 'secretkey', (err, authData) => {
     if(err) {
         //res.json({'err':err,msg:"you have to login"});
         res.redirect('/');
     }
   
     else{
        
         req.authData = authData;
         //console.log(req.authData);
         //console.log(authData);
         next();
      
         }
 
    });

}














// module.exports.verify = (req, res, next)=>{
//   // Get auth header value
//   const bearerHeader = req.headers['authorization'];
//   // Check if bearer is undefined
//   if(typeof bearerHeader !== 'undefined') {
//     // Split at the space
//     const bearer = bearerHeader.split(' ');
//     // Get token from array
//     const bearerToken = bearer[1];
//     // Set the token
//     req.token = bearerToken;
   
//          jwt.verify(req.token, 'secretkey', (err, authData) => {
//            if(err) {
//                res.json({'err':err});
//            }
         
//            else{
              
//                req.authData = authData;
//                console.log(req.authData);
//                console.log(authData);
//                next();
            
//                }
       
//           });
    
//     }

//     else {
//     // Forbidden
//       res.json({msg:'Please provide valid token'});
//     }
  
//   }
