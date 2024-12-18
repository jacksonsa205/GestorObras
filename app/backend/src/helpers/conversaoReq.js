const conversaoReq = (req) => typeof req === 'string'
?  req.split(',').map((m) => `'${m}'`).join(',') 
: req.join(',').split(',').map((m) => `'${m}'`).join(','); 

module.exports = conversaoReq;