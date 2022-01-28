var url = require('url').URL;
const murl = new URL('https://example.com:8000')
console.log(murl.port);
murl.port = '433';
console.log(murl.port);
murl.port = 1234;
console.log(murl.port);
console.log(murl.href);
murl.port='abcd';
console.log(murl.port);
murl.port='567abbcd';
console.log(murl.port);
murl.port=1234.5678;
console.log(murl.port);
console.log(murl.href);



