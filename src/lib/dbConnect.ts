import mongoose from "mongoose"

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to MongoDB")
        return
    }

    try {
        const db=await mongoose.connect(process.env.MONGO_DB_URI!)
        connection.isConnected=db.connections[0].readyState //this actually gives a number which we are storing in the connection object if it gives any else it will be null
        console.log("Db Connected Successfully")

    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }

}

export default dbConnect