import express from 'express'
const app = express();

import router from './router.js'
import path from 'path'
import cors from 'cors';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')))
console.log(__dirname)

// CORS is required for testing @ Chrome, since CORS does not work on localhost
app.use(cors());

// Simple route to get started
app.get("/", (req, res)=>{
    // This message is named after the stage of a game called Need for Madness
    res.json({message: "Paninaro, Caninaro, Let's Fly!"})
})
// Should there be a single router, or can multiple routers coexist?
app.use('/api', router);

let port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`listening on port ${port}...`)})