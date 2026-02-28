// As React uses ECMAScript, I will use ECMAScript for the others as well

import express from 'express';
let router = express.Router();
import districtGa from './assets/ga/GA-Congress-District.json' with { type: 'json' };
import districtIa from './assets/ia/IA-Congress-District.json' with { type: 'json' };
import precinctGa from './assets/ga/GA-Congress-Precinct.json' with { type: 'json' };
import precinctIa from './assets/ia/IA-Congress-Precinct.json' with { type: 'json' };
import dataGa from './assets/ga/GA.json' with { type: 'json' };
import dataIa from './assets/ia/IA.json' with { type: 'json' };
import ginglesGa from './assets/ga/GA-Precinct-Output.json' with { type: 'json' };
import ginglesIa from './assets/ia/IA-Precinct-Output.json' with { type: 'json' };

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
// GET - GeoJSON - District
// Currently: GeoJSON - District [State District Plans (Congress)]
// Currently: Coordinates [Latitude, Longitude]
// I have planned to share coordinates across different parts
// But this led to a race condition, resulting in the map failing to render

router.get('/ia/district', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [districtIa,precinctIa,dataIa]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});

router.get('/ga/district', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [districtGa,precinctGa,dataGa]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});

// GET - GeoJSON - Precinct
// Currently: GeoJSON - Precinct [State Precinct Plans (Congress)]
// Currently: Coordinates [Latitude, Longitude]

router.get('/ia/precinct', async (req,res)=>{
    try {
      // Send the Precinct GeoJSON file, latitude and longitude
        const result = precinctIa
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});

router.get('/ga/precinct', async (req,res)=>{
    try {
      // Send the Precinct GeoJSON file, latitude and longitude
        const result = precinctGa
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