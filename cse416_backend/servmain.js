import express from 'express';
const app = express();
import router from './router.js'

import cors from 'cors';

app.use(express.json());

// CORS is required for testing @ Chrome, since CORS does not work on localhost
app.use(cors());

// Simple route to get started
app.get("/", (req, res)=>{
    // This message is named after the stage of a game called Need for Madness
    // 	Paninaro, Caninaro, Let's Fly!
    res.json({message: "NodeJS, MySQL, Let's Fly!"})
})
// Should there be a single router, or can multiple routers coexist?
app.use('/api', router);

let port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`listening on port ${port}...`)})