// As React uses ECMAScript, I will use ECMAScript for the others as well

import express from 'express';
let router = express.Router();
import geojsonGa from './assets/ga/GA-Congress.json' with { type: 'json' };
import geojsonIa from './assets/ia/IA-Congress.json' with { type: 'json' };
import dataGa from './assets/ga/GA.json' with { type: 'json' };
import dataIa from './assets/ia/IA.json' with { type: 'json' };
import ginglesGa from './assets/ga/ga_precinct_output.json' with { type: 'json' };
import ginglesIa from './assets/ia/ia_precinct_output.json' with { type: 'json' };

// GET - MainMenu
// Get the image of the 2 states
router.get('/', async (req,res)=>{
    try {
        const result = ["http://localhost:3000/assets/ia/iowa.png","http://localhost:3000/assets/ga/georgia.png"]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});

// Get information about individual state
// GET - GeoJSON
// Currently: GeoJSON
// Currently: State District Plans (Congress)
// Currently: State Longitude and Latitude
router.get('/ia/geojson', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [geojsonIa,41.8780,-93.0977,dataIa]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});

router.get('/ga/geojson', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [geojsonGa,33.2478,-83.4411,dataGa]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});

router.get('/ga/gingles', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = ginglesGa
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});

router.get('/ia/gingles', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = ginglesIa
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});


// Future:

export default router;