var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require("body-parser");
var session = require('express-session');
app.listen(8000, function() {
 console.log("listening on port 8000");
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({secret: 'codingdojorocks'}));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './static')));
app.use(express.static(path.join(__dirname, './public/dist')));

var admin = require("firebase-admin");

var serviceAccount = require("./secrets.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodeproject-36d46.firebaseio.com"
});

var db = admin.database();
// var ref = db.ref("restricted_access/secret_document");
var ref = db.ref("server/saving-data/fireblog");
ref.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

var usersRef = ref.child("users");
usersRef.set({
  alanisawesome: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"
  }
});

app.get('/', function(req, res){
    req.session.info;
    res.render("index");

});

app.get('/add', function(req, res){
    var ref = db.ref("server/new");
    var usersRef = ref.child("testuser");
    usersRef.set({
    james: {
        date_of_birth: "June 23, 1912",
        full_name: "james"
    },
    harden: {
        date_of_birth: "December 9, 1906",
        full_name: "bruce"
    }
    });
    res.redirect('/')
});

app.get('/update', function(req, res){
    var ref = db.ref("server/new");
    var usersRef = ref.child("testuser");
    usersRef.update({
        james: {
            test: "teste",
        }},
        function(error) {
            if (error) {
              console.log("Data could not be saved." + error);
            } else {
                console.log("Data saved successfully.");
            }
          }
    );
    res.redirect('/')
});

app.get('/post', function(req, res){
    var postsRef = ref.child("posts");
    var newPostRef = postsRef.push({
        author: "alanisawesome",
        title: "The Turing Machine"
      });
      


        var postId = newPostRef.key;
        console.log(postId)
      res.redirect('/')
})

app.get('/postnew', function(req, res){
    var player = ref.child("player");
    player.push({
        james:"nba player",
    })
    res.redirect('/')
})