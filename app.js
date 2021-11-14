const express = require("express");

const bodyParser = require("body-parser");

const request = require("request");


const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req, res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req , res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const https = require("https");

    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData= JSON.stringify(data);

    const url = "https://us5.api.mailchimp.com/3.0/lists/2d622a2053";

    const options = {
        method: "POST",
        auth: "rishi:a8f8060e26834b2ff1a424d1f829e7de-us5"
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname +"/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000 ,function(){
    console.log("Server listening at port 3000");
});


// api key
// a8f8060e26834b2ff1a424d1f829e7de-us5

// unique id
// 2d622a2053