var base64 = require("crypto-js/enc-base64");
var pbkdf2 = require("crypto-js/pbkdf2");
var log4js = require("log4js");
var argv = require('yargs').option('k', {
    demand: true,
    describe: 'RestrictionsPasswordKey of your iphone',
    type: 'string'
  })
.option('s', {
    demand: true,
    describe: 'RestrictionsPasswordSalt of your iphone',
    type: 'string'
  })
.option('n', {
    describe: 'how many process use to crack your password',
    type: 'string',
     default: require('os').cpus().length,
  })
 .usage('Usage: node ios7hash.js [options]')
  .example('node cracker.js -k W7tAe0hOydAKCYAjeNnj9YZyLXc= -s NzJ4xQ==')
  .argv;

log4js.configure({  
    "appenders":  
        [  
            {  
                "type":"console",  
                "category":"console"  
            },  
            {  
                "category":"file",  
                "type": "file",  
                "filename": "./password.log",  
                "maxLogSize": 104800,  
                "backups": 100  
            },
        ],  
        "replaceConsole": true,  
    "levels":  
    {  
        "file":"ALL",  
        "console":"ALL", 
    }  
} ); 

var loger = log4js.getLogger('console');  

var iosKey=argv['k'];
var iosSalt = argv['s'];
var threadNum = argv['n'];
var passwordStart = 0;
var passwordEnd = 9999;
var passwordNow = passwordStart;
var stopnow = 0;

var checkPassword = function(pwdNow, pwdEnd, iosKey, iosSalt, cb)
{
  var code = pbkdf2(pwdNow+'', base64.parse(iosSalt), {keySize: 5, iterations: 1000});
  //loger.trace("check password: "+pwdNow+", creates base64 key: "+code.toString(base64)); 
  if (code.toString(base64)==iosKey) { 
    //loger.trace("FOUND!! password: "+pwdNow); 
    stopnow = 1;
    cb(pwdNow);
  } else if (pwdNow.toString()==pwdEnd.toString() || stopnow==1) {
    stopnow = 1;
    //loger.trace("Stopping... password: "+pwdNow); 
    cb(false);
  } else { 
     pwdNow++;
     setTimeout(function() { checkPassword(pwdNow, pwdEnd, iosKey, iosSalt, cb); }, 0);
  }
}

var cluster = require('cluster');
var processPwdNum = Math.ceil((passwordEnd-passwordStart)/threadNum);
if (cluster.isMaster) {
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'pwdSuccess') {
      setTimeout(function() {
        loger.info("password force cracking success, your password is: "+msg.ret);
       }, 2000);
      
    }
  }

  for (var i = threadNum- 1; i >= 0; i--) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    //loger.trace('worker ' + worker.process.pid + ' died');
  });
  cluster.on('message',messageHandler);
} else {
  var processPwdStart = passwordStart+(processPwdNum*(cluster.worker.id-1));
  var processPwdEnd = passwordStart+(processPwdNum*cluster.worker.id)-1;
  if(processPwdEnd>=passwordEnd) processPwdEnd = passwordEnd;

  var retHandler = function(pwdRet) {
    if(pwdRet === false){
      //loger.warn('worker:'+cluster.worker.id+' not found password form '+processPwdStart+' to '+processPwdEnd);
    }else if(typeof pwdRet != 'undefined') {
      loger.info('worker:'+cluster.worker.id+" found password: "+pwdRet);
      var json = { "cmd": 'pwdSuccess', "ret": pwdRet };
      process.send(json);
    }
    process.exit(0);
  }
  loger.trace('worker:'+cluster.worker.id+' start at '+processPwdStart+' end at:'+processPwdEnd);
  checkPassword(processPwdStart, processPwdEnd, iosKey, iosSalt, retHandler);
}