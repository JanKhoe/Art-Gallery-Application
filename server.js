const port = 3000

import express from 'express';
import { MongoClient, ObjectId } from "mongodb";
import session from 'express-session';


//User 
//bool isArtist = false;
//obj  likedArtworks = {
//  artworkid : Title
//}
//obj Reviews = {
//  ArtworkId: [review1, review2, etc]
//}
//
//THESE ARE ONLY APPLICABLE IF isArtist == true
//obj Workshops = {}
//obj artworks = {}


// uri - MongoDB deployment's connection 
const uri = "mongodb://127.0.0.1:27017/";
// Create a new client and connect to MongoDB
const client = new MongoClient(uri);
let db = client.db("final-project");
const gallery = db.collection("gallery");
const users = db.collection("users");
const workshops = db.collection("workshops");
// const session = require('express-session');

// express server start
let app = express();

app.use(session({
  secret: "do i even need this here?",
  resave: true,
  saveUninitialized: true
}));

app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("views"));
app.set("views", "views");
// Initialize database first

let requestCount = 0;

//Debuggin function that will log every single request sent to the server
app.use(function(req, res, next){
  console.log("\n============================");
  console.log("Request #" + requestCount);
  console.log(req.method);
  console.log(req.url);
  console.log(req.path);
  console.log(req.session);
  requestCount++;
  console.log(req.session.loggedin == true);
  next();
});

//Routings
app.get("/", sendHomePage);
app.get("/search", handleQuery, sendSearchPage);
app.post("/artworks", function(req, res, next){
  console.log(req.body);
  
  if (Object.keys(req.body).length > 0){
    let queryDoc = {"$and": req.body};
    gallery.find(
      queryDoc
    ).toArray().then(result => {
      console.log("ARTWORK FOUND: ", result);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(result);
    });
  }
});

app.get("/login", sendLoginPage);

// app.param("id", function(req, res, next){
//   console.log("sa;kdlfjs;aldkfjsdaf");
//   next();
// })

let searchViewData = {}
let userViewData = {}

app.get("/artwork/:id", function(req, res, next){
  console.log(req.params.id);
  gallery.findOne(
    {"_id": new ObjectId(req.params.id)}
  ).then(
    result => {
      if(result != undefined){
        let galleryResults = result;
        users.findOne({_id: new ObjectId(req.session.userId)}).then(result =>{
          if(result == null){
            res.render("artwork", {artworkData: galleryResults, sessionData: req.session, isLiked: false});
          }
          else if(req.params.id in result.liked){
            res.render("artwork", {artworkData: galleryResults, sessionData: req.session, isLiked: true});
          }
          else{
            res.render("artwork", {artworkData: galleryResults, sessionData: req.session, isLiked: false});
          }
          
        });
        
      }
    }
  )
});

app.get("/artists/:id", function(req, res, next){
  req.session.viewing =req.params.id;
  
  users.findOne({"_id": new ObjectId(req.params.id)}).then(result =>{
    if(result != null){
      userViewData = result;
      console.log(userViewData);
      let isFollowing = false;
      if(req.session.loggedin){
        console.log(result.followers, "THIS IS IN ARTIST/:ID");
        req.session.artistName = result.name;
        for(let obj in result.followers){
          console.log("OBJSDJFALASDFSAK;FJ;SAFSADF", obj);
          if (result.followers[obj]["userId"] == req.session.userId){
            
            isFollowing = true;
          }
        }
      }
      
      res.render("artist", {UserData: userViewData ,sessionData: req.session, isFollowing: isFollowing});
    }
  });
});

app.get("/workshop/:id",function(req,res,next){
  workshops.findOne({_id: new ObjectId(req.params.id)}).then(result => {
    console.log(result);
    let someBool = false;
    for(let participant in result.Enrolled){
      console.log(participant);
      if(result.Enrolled[participant]["id"] == req.session.userId){
        someBool = true
      }
    }
    console.log(someBool);
    res.render("workshop", {workshopData: result, sessionData: req.session, isEnrolled: someBool});
  })
});

app.get("/create", function(req, res, next){
  res.render("create", {sessionData: req.session});
});

app.get("/createworkshop", function(req,res,next){
  res.render("createworkshop", {sessionData: req.session});
});

app.get("/likedPosts", function(req, res, next){
  users.findOne({"_id": new ObjectId(req.session.viewing)}).then(result => {
    res.setHeader('Content-type', 'application/json');
    res.status(200).json(result.liked);
  });
});

app.get("/reviews", function(req, res, next){
  users.findOne({"_id": new ObjectId(req.session.viewing)}).then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result.reviews);
  });
});

app.get("/enrolled", function(req, res, next){
  users.findOne({_id: new ObjectId(req.session.viewing)}).then(result => {
    res.setHeader("content-type", "application/json");
    res.status(200).json(result.enrolled);
  });
});

app.get("/getFollowing", function (req,res,next){
  users.findOne({_id: new ObjectId(req.session.viewing)}).then(result =>{
    res.setHeader('Content-Type', "application/json");
    res.status(200).json(result.following);
  });
});

app.get("/getFollowers", function(req, res, next){
  users.findOne({_id: new ObjectId(req.session.viewing)}).then(result => {
    res.setHeader('Content-Type', "application/json");
    res.status(200).json(result.followers);
  });
});

app.get("/getFeed", function(req,res, next){
  users.findOne({_id: new ObjectId(req.session.viewing)}).then(result => {
    res.setHeader('Content-Type', "application/json");
    res.status(200).json(result.feed);
  });
});


app.put("/follow", function(req,res,next){
  let toAdd = {}
  toAdd["userId"] = req.session.userId;
  toAdd["userName"] = req.session.userName
  users.findOneAndUpdate({_id: new ObjectId(req.session.viewing)},{$push: {"followers":toAdd}}).then(result => {
    toAdd = {};
    toAdd["userId"] = req.session.viewing;
    toAdd["userName"] = result.name
    users.findOneAndUpdate({_id: new ObjectId(req.session.userId)}, {$push:{"following":toAdd}}).then(result => {
      res.sendStatus(200);
    })
  })
});

app.put("/unfollow", function(req, res, next){
  let toDelete = {}
  toDelete["userName"] = req.session.userName;
  toDelete["userId"] = req.session.userId;
  users.updateOne({_id: new ObjectId(req.session.viewing)}, {$pull:{"followers" :toDelete}}, {returnOriginal: false}).then(result => {
    let toDelete = {}
    toDelete["userName"] = req.session.artistName;
    toDelete["userId"] = req.session.viewing;
    console.log(result);
    console.log(toDelete, "this is my to Delete Obj");
    users.updateOne({_id: new ObjectId(req.session.userId)}, {$pull:{"following" :toDelete}}, {returnOriginal: false}).then(result =>{
      console.log(result, "RESULT AFTER UNFOLLOW");
      res.sendStatus(200);
    });
  });
});

app.put("/logout", function(req,res,next){
  req.session.loggedin = false;
  req.session.userId = "";
  req.session.userName = "";
  res.sendStatus(200);
});

app.put("/upgrade", function(req,res,next){
  users.findOne({"_id": new ObjectId(req.session.userId)}).then(result => {
    if(result == null){
      console.log('ERROR IN UPGRADE USER IS NULL');
    }
    else{
      if(Object.keys(result.artworks).length == 0){
        res.sendStatus(400);
      }
      else{
        users.updateOne({_id: new ObjectId(req.session.userId)}, {$set: {isArtist: true}}).then(result => {
          console.log(result);
          res.sendStatus(200);
        });
        
      }
    }
  });
});

app.put("/downgrade", function(req, res, next){
  users.findOneAndUpdate({_id: new ObjectId(req.session.userId)}, {$set: {isArtist: false}}).then(result => {
    console.log(result, "RESULTS FROM SETTTING ISARTIST TO FALSE");
    res.sendStatus(200);
  });
});

app.put("/artwork/:id/like", function(req, res, next){
  console.log("request recieved");
  
  gallery.findOneAndUpdate(
    {"_id": new ObjectId(req.params.id)},
    {$inc:{Likes:1}}
  ).then(result =>{
    let someStr = "liked."+req.params.id;
    let toAdd = {};
    toAdd[someStr] = result.Title;
    users.findOneAndUpdate(
      
      {_id: new ObjectId(req.session.userId)},
      {$set: toAdd}
    );
  });
  res.sendStatus(200);
});

app.put("/artwork/:id/unlike", function(req, res, next){
  console.log("unlike recieved");
  gallery.findOneAndUpdate(
    {"_id": new ObjectId(req.params.id)},
    {$inc:{Likes:-1}}
  ).then(result =>{
    let someStr = "liked."+req.params.id;
    let toRmv = {};
    toRmv[someStr] = result.Title;
    users.findOneAndUpdate(
      
      {_id: new ObjectId(req.session.userId)},
      {$unset: toRmv}
    );
  });
  res.sendStatus(200);
});

app.put("/enroll/:id", function(req,res, next){
  let toAdd = {};
  toAdd["Name"] = req.session.userName;
  toAdd["id"] = req.session.userId;
  console.log(toAdd, "1");
  
  workshops.findOneAndUpdate({_id: new ObjectId(req.params.id)}, {$push: {"Enrolled": toAdd}}).then(result =>{
    console.log(result);
    toAdd = {};
    toAdd["Title"] = result.Title;
    toAdd["id"] = result["_id"];
    console.log(toAdd, "2");
    users.updateOne({_id: new ObjectId(req.session.userId)}, {$push: {"enrolled": toAdd}}).then(result =>{
      res.sendStatus(200);
    })
  });
});

app.put("/unenroll/:id", function(req,res,rext){
  let toRemove = {};
  toRemove["Name"] = req.session.userName;
  toRemove["id"]=req.session.userId;
  workshops.findOneAndUpdate({_id: new ObjectId(req.params.id)}, {$pull: {"Enrolled": toRemove}}).then(result =>{
    let toDelete = {};
    toDelete["Title"] = result.Title;
    toDelete["id"] = result["_id"];
    users.updateOne({_id: new ObjectId(req.session.userId)}, {$pull: {'enrolled': toDelete}}).then(result => {
      res.sendStatus(200);
    });
  });
});

app.post("/artwork/:id/review", function(req, res, next){
  console.log("HELLO THIS IS THE BODY", req.body);
  let toAdd = {}
  gallery.findOne({_id: new ObjectId(req.params.id)}).then(result => {
    let galleryInfo = result;
    if(Object.hasOwn(result.Reviews, req.session.userId)){
      toAdd["Reviews." + req.session.userId] = {"Name": req.session.userName, "Review": req.body.Review};
      gallery.findOneAndUpdate({_id: new ObjectId(req.params.id)}, {$push: toAdd});
      toAdd = {};
      toAdd["reviews." + req.params.id] = {"name": result.Title, "review": req.body.Review};
      users.updateOne({_id: new ObjectId(req.session.userId)}, {$push: toAdd}).then(result => {
        users.findOne({_id: new ObjectId(req.session.userId)}).then(result => {
          console.log(result);
          console.log(result["reviews"]);
          console.log(result["reviews"][req.params.id]);
          res.setHeader("content-type", "application/json");
          res.status(200).json({"Name": req.session.userName, "Review": req.body.Review, "id": req.session.userId, "index": Object.keys(result["reviews"][req.params.id]).length-1, "ArtworkName": galleryInfo.Title, "ArtworkId": galleryInfo["_id"].toString()});
        });
        
      });
      
    }
    else{
      toAdd["Reviews." + req.session.userId] = [{"Name": req.session.userName, "Review": req.body.Review}];
      gallery.findOneAndUpdate({_id: new ObjectId(req.params.id)}, {$set: toAdd});
      toAdd = {};
      toAdd["reviews." + req.params.id] = [{"name": result.Title, "review": req.body.Review}];
      users.updateOne({_id: new ObjectId(req.session.userId)}, {$set: toAdd}).then(result => {
        users.findOne({_id: new ObjectId(req.session.userId)}).then(result => {
          console.log(result);
          console.log(result["reviews"]);
          console.log(result["reviews"][req.params.id]);
          res.setHeader("content-type", "application/json");
          res.status(200).json({"Name": req.session.userName, "Review": req.body.Review, "id": req.session.userId, "index": Object.keys(result["reviews"][req.params.id]).length-1, "ArtworkName": galleryInfo.Title, "ArtworkId": galleryInfo["_id"].toString()});
        });
      });
    }
    
  });
});

app.post("/artwork/:id/unreview", function(req, res, next){
  
  
  gallery.findOne({_id: new ObjectId(req.params.id)}).then(result =>{
    console.log(result);
    console.log(req.body);
    let toDelete = {};
    toDelete["reviews." +req.params.id] = {
      name: result.Title,
      review: req.body.review,
    }
    console.log(toDelete);
    users.updateOne({_id: new ObjectId(req.session.userId)}, {$pull: toDelete}).then(result => {
    console.log(result);
    toDelete = {};
    toDelete["Reviews." +req.session.userId] = {
      Name: req.session.userName,
      Review: req.body.review,
    }
    console.log(toDelete);
    gallery.updateOne({_id: new ObjectId(req.params.id)}, {$pull: toDelete}).then(result => {
      console.log(result)
      res.sendStatus(200);
    })
  })
  });
  
});

app.post("/signup", function(req, res, next){
  let userTemplate = {
    "name": "",
    "password": "",
    'isArtist': false,
    'liked': {},
    'reviews': {},
    'artworks': {},
    'followers': [],
    'following': [],
    'feed': [],
    'workshops': [],
    'enrolled': [],
    
  }
  console.log(req.body);
  users.findOne({"name": req.body.Username}).then(result => {
    if(result == null){
      userTemplate.name = req.body.Username;
      userTemplate.password = req.body.Password;
      users.insertOne(userTemplate).then(result => {
        console.log(result);
        req.session.loggedin = true;
        req.session.userId = result.insertedId.toString();
        req.session.userName = req.body.Username;
        res.sendStatus(200);
      });
      return;
    }
    else{
      res.sendStatus(400);
    }
  });
});

app.post("/signin", function(req, res, next){
  users.findOne({"name": req.body.Username, "password": req.body.Password}).then(result => {
    if (result != null){
      req.session.loggedin = true;
      req.session.userId = result["_id"].toString();
      req.session.userName = result.name;
      res.sendStatus(200);
    }
    else{
      res.sendStatus(400);
    }
  });
});

app.post("/newWorkshop", function(req,res,next){
  let newWorkshopTemplate = {
    "Title": req.body.Title,
    "Date": req.body.Date,
    "Description": req.body.Description,
    "Artist": req.session.userName,
    "Enrolled": [],
    "ArtistId": req.session.userId
  }
  
  workshops.findOne({"Title": req.body.Title}).then(result => {
    if (result == null){
      workshops.insertOne(newWorkshopTemplate).then(result =>{
        let toAdd = {};
        toAdd["PostType"] = 2;
        toAdd["id"] = newWorkshopTemplate["_id"];
        toAdd["Title"] = req.body.Title;
        toAdd["Artist"] = newWorkshopTemplate["Artist"];
        toAdd["ArtistId"] = req.session.userId;
    
        let workshopData = {};
        workshopData["Title"] = newWorkshopTemplate.Title;
        workshopData["Date"] = newWorkshopTemplate.Date;
        workshopData["id"] = result.insertedId;
        users.findOneAndUpdate({_id: new ObjectId(req.session.userId)}, {$push: {"workshops": workshopData}}).then(result => {
          for (let i in result.followers){
            users.updateOne({_id: new ObjectId(result.followers[i]["userId"])}, {$push: {"feed": toAdd}});
          }
        })
        res.sendStatus(200);
      })
    }
    else{
      res.sendStatus(400);
    }
  })
});

app.post("/newArtwork", function(req, res, next){
  users.findOne({_id: new ObjectId(req.session.userId)}).then(result => {
    let userData = result;
    if (result.isArtist){
      let newArtworkTemplate = {
        "Title": req.body.Title,
        "Artist": req.session.userName,
        "Year": req.body.Year,
        "Category": req.body.Category,
        "Medium": req.body.Medium,
        "Description": req.body.Description,
        "Poster": req.body.Poster,
        "Likes": 0,
        "Reviews": {},
        "ArtistId": req.session.userId
      }
      gallery.findOne({Title: req.body.Title}).then(result =>{
        if(result == null){
          gallery.insertOne(newArtworkTemplate).then(result => {
            let toAdd = {};
            toAdd["PostType"] = 1;
            toAdd["id"] = result.insertedId.toString();
            toAdd["Title"] = newArtworkTemplate["Title"];
            toAdd["Artist"] = newArtworkTemplate["Artist"];
            for(let i in userData.followers){
              users.updateOne({_id: new ObjectId(userData.followers[i]["userId"])}, {$push:{"feed": toAdd}}).then(result =>{
                console.log("operations comeplete!", result);}
              );
            }
            toAdd = {};
            toAdd["artworks."+result.insertedId] = newArtworkTemplate["Title"];
            toAdd["isArtist"] = true;
              
            users.findOneAndUpdate({_id: new ObjectId(req.session.userId)}, {$set: toAdd}).then( result => {
              res.sendStatus(200)}
            );
            
          });
        }
        else{
          res.sendStatus(400);
        }
      });
      
    }
    else{
      let newArtworkTemplate = {
        "Title": req.body.Title,
        "Artist": req.session.userName,
        "Year": req.body.Year,
        "Category": req.body.Category,
        "Medium": req.body.Medium,
        "Description": req.body.Description,
        "Poster": req.body.Poster,
        "Likes": 0,
        "Reviews": {},
        "ArtistId": req.session.userId
      }
      gallery.findOne({Title: req.body.Title}).then(result =>{
        if(result == null){
          gallery.insertOne(newArtworkTemplate).then(result => {
            let toAdd = {};
            toAdd["artworks."+result.insertedId] = newArtworkTemplate["Title"];
            toAdd["isArtist"] = true;
              
            users.findOneAndUpdate({_id: new ObjectId(req.session.userId)}, {$set: toAdd}).then( result => {
              res.sendStatus(201)}
            );
          });
        }
        else{
          res.sendStatus(400);
        }
      }); 
    }
  });
});

app.listen(port);
console.log(`http://localhost:${port}`);

function logIn(req, res, next, result){
    console.log(result);
    
}

function handleQuery(req, res, next){
  console.log(req.query);
  
  searchViewData.setSearch = req.query;
  searchViewData.sessionData = req.session;
  next();
}

function sendSearchPage(req, res, next){
  
  res.render("search", searchViewData);
}

function sendHomePage(req, res, next){
  res.render("index", {sessionData: req.session});
}

function sendLoginPage(req, res, next){
  res.render("login", {sessionData: req.session} );
}

app.use(function(req, res, next){
  res.render("404", {sessionData: req.session});
});