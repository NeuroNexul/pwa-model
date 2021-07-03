const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const port = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client")));

const vapidKey = {
      public : "BELxfHwSbp4tWsnsbZPJuPOa7ddi5GYoL7XAJHHPlGBiHgj6IPEdamzRzhMjsBdw-5h-EA3e6W0HqYqrjEYXJTw",
      private : "xiA78d7o-bStDw5dAGrJxbjCXUVQci-zDPL5fbBl5o0"
};
webpush.setVapidDetails( 
      "mailto:test@test.com",
      vapidKey.public,
      vapidKey.private
);

const payload = JSON.stringify({ 
      title: "Push Test",
      body: "This Is An Push Notification Test...",
      icon: "/favicon.png",
      // image : "http://image.ibb.co/frYOFd/tmlogo.png",
      actions : [
            {
                  action : "",
                  title : "Close",
                  icon : ""
            }
      ]
});
var subscription = [];
// Subscribe Route
app.post("/subscribe", (req, res) => {
      // Get pushSubscription object
      // subscription = req.body;
      subscription.push(req.body);
    
      // Send 201 - resource created
      res.status(201).json({});
    
      // Create payload
    
      // Pass object into sendNotification
      webpush.sendNotification(req.body, payload)
            .catch(err => console.error(err));
});

app.get("/test/:no", (req, res, next)=>{
      webpush.sendNotification(subscription[req.params.no], payload)
            .catch(err => console.error(err));
      res.send("Done");

});

// app.get("/", (req, res, next)=>{
//       res.send(path.join(__dirname, "client/index.js"));
// });

app.listen(port , err=>{
      if(!err){
            console.log(`App is started on ${port}`);
      } else {
            console.error(err);
      }
})
