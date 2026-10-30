
import "dotenv/config" ; 
import cors from "cors";
import express from "express"; 
import { MongoClient, ObjectId } from 'mongodb';



const app = express();
const port = process.env.PORT || 5000 ;

// middleware
app.use(cors());
app.use(express.json());

//.......... mongo db...........
const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } 
        catch (err) {
        console.dir(err);
    }
}

const connectedClient = await connectToMongoDB() ;

const db = connectedClient.db("Rest-Api-Crud-Admin");
const users = db.collection("users") ;
// ................................


app.get("/" , (req,res) => {
    res.send("Simple Crud is Running");
})

// get users data
app.get("/users" , async( req , res ) => {
    const cursor = users.find({}) ;
    const allUsers = await cursor.toArray() ;
    res.send(allUsers) ;
})


// single user data

app.get("/users/:id" , async (req,res) =>{
    console.log("params in the server",req.params);

    const id = req.params.id ;

    const query = { _id: new ObjectId(id) };
    const result = await users.findOne(query) ;
    res.send(result) ;

})


//add user
app.post("/users" , async(req,res) => {
    const newUser = req.body ;
    const result = await users.insertOne(newUser) ;
    
    res.send(result) ;

    console.log("Adding new user : " , newUser) ;
})


// updating a user 
app.patch("/users/:id" , async (req,res) =>{
    const id = req.params.id ;
    const updatedUser = req.body ;

    const filter = { 
        _id: new ObjectId(id)
    } ;

    const options = { upsert: true } ;
    const updateDoc = {
        $set:{
            name: updatedUser.name ,
            email: updatedUser.email
        }
    }

    const result = await users.updateOne(filter , updateDoc , options) ;

    res.send(result) ;

    

})





// deleting a user  (specific one)
app.delete("/users/:id" , async (req,res) =>{

    const id = req.params.id ;
    const query = { _id: new ObjectId(id)} ;
    const result = await users.deleteOne(query) ;

    res.send(result) ;
})


app.listen(port ,() =>{
    console.log(`Crud Server is Running On Port : ${port}`);
} )