/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');






        ////////////////////Voting App//////////////////////////




        const express = require('express')
        const session = require('express-session')
        const bodyParser = require('body-parser');
        var _ = require('lodash');
        var sortJsonArray = require('sort-json-array');


        const TWO_HOUR = 1000 * 60 * 60 * 2

        const app = express()

        const {
            PORT = 3000,
            NODE_ENV = 'development',
            SESS_NAME = 'katha',
            SESS_SECRET = 'SECRET!!!!!!!',
            SESS_LIFETIME = TWO_HOUR



        } = process.env

        const IN_PROD = NODE_ENV === 'production'

        const redirectlohin = (req, res, next) => {
            if (!req.session.userId) {
                res.redirect('/login');
            } else {
                next();
            }
        }
        const redirectaddElection = (req, res, next) => {
            if (!req.session.adminId) {
                res.redirect('/admin');
            } else {
                next();
            }
        }

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express.static(__dirname + '/files'));
        app.use(session({

            name: SESS_NAME,
            resave: false,
            saveUninitialized: false,
            secret: SESS_SECRET,
            cookie: {
                maxAge: SESS_LIFETIME,
                sameSite: true,
                secure: IN_PROD
            }
        }))
        app.use(express.static('public'));







        app.get('/', async function (req, res) {
            const { userNid, userEmail, userPassword } = req.session;

            const result = await contract.evaluateTransaction('allNews');
            const kkk = JSON.parse(result);
            sortJsonArray(kkk,'Record.Date','des');
            const sorted = Object.values(kkk).sort((a, b) => a.Record.Date.localeCompare(b.Record.Date));
            console.log(sorted);

            var text = "";
            for (var i = kkk.length-1; i>=0; i--) {
                
                text += "<h1>" + sorted[i].Record.Anouncement + "</h1>"
                text+="<p>Date: "+sorted[i].Record.Date+"</p>"
                text+="<p>";
                text += sorted[i].Record.Text;
                text += "</p>"
            }

            res.send(`
            <!DOCTYPE html>
            <html>
            
            <head>
              <meta charset="UTF-8">
             <link rel="stylesheet" href="home.css">
            
            </head>
            
            <body>
            
              <div class="topnav">
                <a class="active">Voting System</a>
                <div class="topnav-right">
                  <a href="/register">SignUp</a>
                  <a href="/login">Login</a>
                </div>
              </div>
              <div class="verticalnav">
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/getresult">Result</a></li>
                      <li><a href="/electionList">Elections</a></li>
                  <li><a href="/admin">Admin</a></li>
                </ul>
              </div>
              <div class ="main">
                
                ${text}
                
              </div>
            
            
            </body>
            
            </html>
            `);
        })

        app.get('/admin', function (req, res) {
            const { adminId, adminEmail, adminPassword, electionName, thana } = req.session;
            res.sendFile(__dirname + "/" + "files/admin.html");
        })

        app.get('/addCandidate', function (req, res) {

            res.sendFile(__dirname + "/" + "files/candidate.html");
        })

        app.get('/addElection', redirectaddElection, function (req, res) {
            res.sendFile(__dirname + "/" + "files/election.html");
        })

        app.get('/register', function (req, res) {
            res.sendFile(__dirname + "/" + "files/signup.html");
        })

        app.post('/admin', async function (req, res) {

            try {


                var email = req.body.Email;

                var passward = req.body.Password;
                var docktype = 'comission';
                const result = await contract.evaluateTransaction('admin', email, passward);
                let kkk = JSON.parse(result);
                req.session.adminId = kkk[0].Key;
                req.session.adminEmail = kkk[0].Record.Email;
                req.session.adminPassword = kkk[0].Record.Password;



                res.redirect('/addelection');
            } catch{
                console.log(err);
                res.send('ERR 400');
            }



        })

        app.get('/electionList', redirectaddElection, async function (req, res) {
            const result = await contract.evaluateTransaction('allElection');
            const kkk = JSON.parse(result);

            var text = "";
            for (var i = 0; i < kkk.length; i++) {
                text += "<tr>"
                text += "<td>" + kkk[i].Record.Name + "</td>"
                text += "<td>" + "<a class=\"btn btn-success\" href=\"/state/" + kkk[i].Key + "\">End Election</a></td><br><br>"
                text += "</tr>"
            }

            res.send(`
            <!doctype html>
            <html lang=''>
            
            <head>
            <meta charset="UTF-8">
            <link rel = "stylesheet" href="login.css">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
            crossorigin="anonymous">
      
            </head>
            
            <body>
            
            <div class="topnav">
            <a class="active">Voting System</a>
            <div class="topnav-right">
              <a href="register">SignUp</a>
              <a href="login">Login</a>
            </div>text
          </div>
          <div class="verticalnav">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/getresult">Result</a></li>
		      <li><a href="/electionList">Elections</a></li>
              <li><a href="/admin">Admin</a></li>
            </ul>
          </div>
          <div style="margin-left:25%;margin-top:50px;padding:1px 16px;height:1000px;">
              <h1> Election List:</h1>
              
              
              <table class="table table-hover">
              <thead>
                 <tr>
                    <th>Name</th>
                    <th>Vote</th>
                 </tr>
              </thead>
              <tbody>
                 ${text}
     
              </tbody>
           </table>

            

          </div>
            
            
            </body>
            <html>
            `);
        })
        app.get('/getresult', async function (req, res) {
            const result = await contract.evaluateTransaction('resultElection');
            const kkk = JSON.parse(result);
            

            var text = "";
            var text2 = "";
            
            for (var i = 0; i < kkk.length; i++) {

                const candidate = await contract.evaluateTransaction('candidateList', kkk[i].Key.toString(), kkk[i].Record.Thana.toString());
                const candidatekkk = JSON.parse(candidate);
               // const candidatekkk = Object.values(res).sort((a, b) => a.Record.Totalvote.localeCompare(b.Record.Totalvote));
                text+="<table class=\"table table-hover\">"
                text+="<h1><b>" + kkk[i].Record.Name + "</b></h1>";
                text+="<thead>";
                text+="<tr>"
                text+="<th>Name</th>";
                text+="<th>Sign</th>";
                text+="<th>Total Vote</th>";
                text+="</tr>";
                for (var j = 0; j < candidatekkk.length; j++) {
                    text += "<tr>"
                    text += "<td>" + candidatekkk[j].Record.Name + "</td>"
                    text += "<td>" + candidatekkk[j].Record.Sign + "</td>"
                    text += "<td>" + candidatekkk[j].Record.Totalvote + "</td>"
                    text += "</tr>"
                }
                text+="</tbody>"
                text+="</table>"
            }

            res.send(`
            <!doctype html>
            <html lang=''>
            
            <head>
            <meta charset="UTF-8">
            <link rel = "stylesheet" href="login.css">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
            crossorigin="anonymous">
      
            </head>
            
            <body>
            
            <div class="topnav">
            <a class="active">Voting System</a>
            <div class="topnav-right">
              <a href="register">SignUp</a>
              <a href="login">Login</a>
            </div>text
          </div>
          <div class="verticalnav">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/getresult">Result</a></li>
              <li><a href="/electionList">Election</a></li>
              <li><a href="/admin">Admin</a></li>
            </ul>
          </div>
          <div style="margin-left:25%;margin-top:50px;padding:1px 16px;height:1000px;">
              <h1> Election List:</h1>
              
              
              
              ${text2}
              
              ${text}
     
              

            

          </div>
            
            
            </body>
            <html>
            `);
        })
        app.get('/state/:key', async function (req, res) {
            console.log(req.params.key);
            var voteket = req.params.key;
            await contract.submitTransaction('removeElection', voteket);

            res.redirect('/electionList')
        })

        app.post('/register', async function (req, res) {

            try {

                var nid = req.body.Nid;
                var email = req.body.email;
                var name = req.body.name;
                var birthdate = req.body.birthdate;
                var passward = req.body.Password;
                var division = req.body.division;
                var distric = req.body.distric;
                var thana = req.body.thana;
                var docktype = 'voter';

                var key = makeid(20)

                const request = await contract.submitTransaction('createVoter', key, nid, email, name, birthdate, division, distric, thana, passward, 'voter');

                console.log(nid);

                res.redirect('/login');

            } catch{
                res.send('ERR 400');
            }



        })
        app.get('/user', redirectlohin, async function (req, res) {
            const { userKey ,electionKey} = req.session;
            const result = await contract.evaluateTransaction('login', req.session.userId.toString(), req.session.userEmail, req.session.userPassword);
            const kkk = JSON.parse(result);
            console.log(kkk[0]);
            console.log(kkk.length);

            req.session.userKey = kkk[0].Key;
            const election = await contract.evaluateTransaction('voterElection', kkk[0].Record.Thana.toString());
            const electionkkk = JSON.parse(election);
            console.log(electionkkk)
            
            var text = "";
            var text2 = "";

            if (electionkkk.length) {
                const vote = await contract.evaluateTransaction('hasVote', kkk[0].Key.toString(), electionkkk[0].Key);
                const votekkk = JSON.parse(vote);
                console.log(votekkk);
  
                if (votekkk.length != 0) {
                    text2 += "<h1><b>" + "!!!You Have Already Voted!!!"+ "</b></h1>";
                }
                else{
                req.session.electionKey = electionkkk[0].Key

                const candidate = await contract.evaluateTransaction('candidateList', electionkkk[0].Key ,electionkkk[0].Record.Thana.toString());
                const candidatekkk = JSON.parse(candidate);
                console.log(candidatekkk)
                text2 += "<h1><b>" + electionkkk[0].Record.Name + "</b></h1>";
                for (var i = 0; i < candidatekkk.length; i++) {

                    text += "<tr>"
                    text += "<td>" + candidatekkk[i].Record.Name + "</td>"
                    text += "<td>" + candidatekkk[i].Record.Sign + "</td>"
                    text += "<td>" + "<a class=\"btn btn-success\" href=\"/vote/" + candidatekkk[i].Key + "/\">Vote</a></td><br><br>"
                    text += "</tr>"
                }
                }


            }


           
           

            
            res.send(`
            <!doctype html>
            <html lang=''>
            
            <head>
               <meta charset='utf-8'>
               <link rel = "stylesheet" href="login.css">
            
               <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
                  crossorigin="anonymous">
        
            
            
               
            </head>
            
            <body>
            <div class="topnav">
            <a class="active">Voting System</a>
            <div class="topnav-right">
              <a href="register">SignUp</a>
              <a href="login">Login</a>
            </div>text
          </div>
          <div class="verticalnav">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/getresult">Result</a></li>
              <li><a href="/electionList">Elections</a></li>
              <li><a href="/admin">Admin</a></li>
            </ul>
          </div>
            
               <div id='cssmenu' style="margin-left:25%;margin-top:50px;padding:1px 16px;height:1000px;">
                <div>
                  <h1>Voter Profile</h1>
                  <ul>
                     <br>
                     <li>Nid: ${kkk[0].Record.Nid}</li>
                     <li>Name: ${kkk[0].Record.Name} </li>
                     <li>Email: ${kkk[0].Record.Email}</li>
                    
                     <li class="pull-right"><a class="btn btn-success" href='/logout'>Log Out</a></li>
                  </ul>
               </div>
            
               <div class="container" >
               <br>
               ${text2}
                
                  <table class="table table-hover">
                     <thead>
                        <tr>
                           <th>Name</th>
                           <th>Sign</th>
                           <th>Vote</th>
                        </tr>
                     </thead>
                     <tbody>
                       ${text}
            
                     </tbody>
                  </table>
               </div>
            </div>
            
            </body>
            <html>
            
            `)

        })
        app.get('/vote/:id', async function (req, res) {
            try {
                var userkey = req.session.userKey;
                var candidateKey = req.params.id;
                var electionKey = req.session.electionKey
                console.log(candidateKey);
                var key = makeid(20);
                await contract.submitTransaction('addVote', key, userkey,electionKey, candidateKey);
                res.sendFile(__dirname + "/" + "files/successvote.html");

            } catch{
                res.send(`ERR 404`);
            }
        })

        app.post('/login', async function (req, res) {

            try {

                var nid = req.body.nid;
                var email = req.body.email;

                var passward = req.body.Password;
                var docktype = 'voter';


                const result = await contract.evaluateTransaction('login', nid, email, passward);

                let kkk = JSON.parse(result);

                req.session.userId = kkk[0].Record.Nid;
                req.session.userEmail = kkk[0].Record.Email;
                req.session.userPassword = kkk[0].Record.Password;

                res.redirect('/user');
            } catch{
                res.send('ERR 400');
            }



        })

        app.post('/addCandidate', async function (req, res) {

            try {
                console.log(req.session);

                var electionname = req.session.electionName.toString();
                var candidate = req.body.candidateName;
                var thana = req.session.thana.toString();
                var sign = req.body.sign;

                var docktype = 'candidate';
                var totalvote = '0';

                var key = makeid(20)

                const request = await contract.submitTransaction('createCandidate', key, candidate, electionname, thana, totalvote, sign, docktype);

                res.redirect('/addCandidate');
            } catch{
                res.send('ERR 400');
            }
        })

        app.post('/addElection', async function (req, res) {

            try {

                var electionname = req.body.addElection;

                var division = req.body.division;
                var distric = req.body.distric;
                var thana = req.body.thana;

                var docktype = 'candidate';

                var key = makeid(20)

                const request = await contract.submitTransaction('createElection', key, electionname, division, distric, thana, docktype);

                req.session.electionName = key;
                req.session.thana = thana;

                res.redirect('/addCandidate');
            } catch{
                res.send('ERR 400');
            }



        })

        app.post('/addNews', async function (req, res) {

            try {

                var name = req.body.name;
                var date = req.body.date
                var text = req.body.comment

                var docktype = 'news';

                var key = makeid(20)
                

                const request = await contract.submitTransaction('createNews',key,name,text,date,docktype);
                
                // req.session.electionName = key;
                // req.session.thana = thana;

                res.redirect('/admin');
            } catch{
                res.send('ERR 400');
            }



        })

        app.get('/login', function (req, res) {

            res.sendFile(path.join(__dirname + "/files/login.html"));


        })
        app.get('/logout', function (req, res) {
            req.session.destroy(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect('/');
                }
            });

        });


        app.get('/process_get', function (req, res) {

            response = {
                first_name: req.query.first_name,
                last_name: req.query.last_name
            };
            console.log(response);
            res.end(JSON.stringify(response));
        })

        var server = app.listen(8081, function () {
            var host = server.address().address
            var port = server.address().port

            console.log("Example app listening at http://%s:%s", host, port)
        })



        ////////////////////////////////////////////////////
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
