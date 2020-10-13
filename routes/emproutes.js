const express =require('express');
const router=express.Router();

const auth = require('../middleware/authentication')
const empRoutes = require('../controller/empcontroller');



router.get('/',  empRoutes.emslogin);
router.post('/loginsubmit', empRoutes.validate('loginsubmit') ,  empRoutes.loginsubmit);
router.get('/createemp', auth.verify,  empRoutes.empsignup);
router.post('/signupsubmit', auth.verify, empRoutes.signupsubmit);
router.get('/viewemp',    auth.verify , empRoutes.viewemp);
router.get('/deleteemp',  auth.verify  , empRoutes.deleteemp);
router.get('/updateselect', auth.verify , empRoutes.updateselect);
router.post('/updatedata', auth.verify , empRoutes.updatedata);
router.get('/logout',       empRoutes.logout);



module.exports = router;



