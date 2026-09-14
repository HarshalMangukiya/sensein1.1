const express=require("express");
const multer=require("multer");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const app=express();

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({secret:"exam",resave:false,saveUninitialized:true}));
app.use(express.static("public"));

const storage=multer.diskStorage({
 destination:"uploads",
 filename:(req,file,cb)=>cb(null,file.originalname)
});
const upload=multer({storage});

function checkUser(req,res,next){
 if(req.body.username==="admin") next();
 else res.send("<h2 style='color:red'>Invalid Username</h2>");
}

app.post("/login",upload.single("myfile"),checkUser,(req,res)=>{
 const {name,email,username,password,age,message,subscribe}=req.body;
 req.session.username=username;
 req.session.password=password;
 res.cookie("name",name,{maxAge:60000});
 res.cookie("email",email,{maxAge:60000});

 if(password!=="admin@123") return res.send("<h2>Wrong Password</h2>");

 let count=0;
 for(const ch of (message||"").toLowerCase()){
   if("aeiou".includes(ch)) count++;
 }

 res.write("<h2>Login Successful</h2>");
 res.write("Name: "+name+"<br>");
 res.write("Email: "+email+"<br>");
 res.write("Age: "+age+"<br>");
 if(req.file) res.write("Uploaded File: "+req.file.originalname+"<br>");
 res.write("Vowels in Message: "+count+"<br>");
 if(subscribe) res.write("<h3>Thank You For Subscription</h3>");
 else res.write("<h3>Please Subscribe</h3>");
 res.write("<a href='/cookie'>Cookie</a><br>");
 res.write("<a href='/session'>Session</a><br>");
 res.write("<a href='/logout'>Logout</a>");
 res.end();
});

app.get("/cookie",(req,res)=>{
 res.send("Name: "+req.cookies.name+"<br>Email: "+req.cookies.email+"<br><a href='/'>Home</a>");
});

app.get("/session",(req,res)=>{
 res.send("Username: "+req.session.username+"<br>Password: "+req.session.password+"<br><a href='/'>Home</a>");
});

app.get("/logout",(req,res)=>{
 req.session.destroy(()=>{
   res.clearCookie("connect.sid");
   res.redirect("/");
 });
});

app.listen(3000,()=>console.log("Server Running on http://localhost:3000"));
