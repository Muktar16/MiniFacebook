// const jwt = require('jsonwebtoken');

// module.exports.verifyJwtToken = async (req, res, next) => {
//     //console.log(req.body.token);
//     var ret;    
//     jwt.verify(req.body.token, process.env.JWT_SECRET,
//             (err, decoded) => {
//                 if(err)
//                     ret = { status: false, message: 'Token authentication failed' };
//                 else{
//                     ret = decoded;
//                 }
//             }
//         )
//     return res.send(ret);

// }



// const jwt = require('jsonwebtoken');

// module.exports.verifyJwtToken = (req, res, next) => {
//     var token;
//     if ('authorization' in req.headers)
//         token = req.headers['authorization'].split(' ')[1];
//     if (!token)
//         return res.status(403).send({ auth: false, message: 'No token provided.' });
//     else {
//         jwt.verify(token, process.env.JWT_SECRET,
//             (err, decoded) => {
//                 if (err)
//                     {
//                         console.log(err)
//                         return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
//                     }
//                 else {
//                     console.log(decoded._id)
//                     req._id = decoded._id;
//                     next();
//                 }
//             }
//         )
//     }
// }


