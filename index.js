
import "dotenv/config" ; 
import cors from "cors";
import express from "express"; 
import { MongoClient } from 'mongodb';



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


app.listen(port ,() =>{
    console.log(`Crud Server is Running On Port : ${port}`);
} )