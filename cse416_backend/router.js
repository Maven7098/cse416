// As React uses ECMAScript, I will use ECMAScript for the others as well

import express from 'express';
let router = express.Router();

// Home Menu
import ga from './assets/ga/georgia.json' with { type: 'json' };
import ia from './assets/ia/iowa.json' with { type: 'json' };

// Part 1: Current Districts
import districtGa from './assets/ga/GA-Congress-District.json' with { type: 'json' };
import districtIa from './assets/ia/IA-Congress-District.json' with { type: 'json' };
import precinctGa from './assets/ga/GA-Congress-Precinct.json' with { type: 'json' };
import precinctIa from './assets/ia/IA-Congress-Precinct.json' with { type: 'json' };
import dataGa from './assets/ga/GA.json' with { type: 'json' };
import dataIa from './assets/ia/IA.json' with { type: 'json' };
import ginglesGa from './assets/ga/GA-Precinct-Output.json' with { type: 'json' };
import ginglesIa from './assets/ia/IA-Precinct-Output.json' with { type: 'json' };

// Part 2: Proposed Districts
import boxGaVra from './assets/ga/GA-Box-Data-VRA.json' with { type: 'json' };
import boxGaNonVra from './assets/ga/GA-Box-Data-NonVRA.json' with { type: 'json' };
import boxIaVra from './assets/ia/IA-Box-Data-VRA.json' with { type: 'json' };
import boxIaNonVra from './assets/ia/IA-Box-Data-NonVRA.json' with { type: 'json' };
import ensembleGaVra from './assets/ga/GA-Ensemble-Data-VRA.json' with { type: 'json' };
import ensembleGaNonVra from './assets/ga/GA-Ensemble-Data-NonVRA.json' with { type: 'json' };
import ensembleIaVra from './assets/ia/IA-Ensemble-Data-VRA.json' with { type: 'json' };
import ensembleIaNonVra from './assets/ia/IA-Ensemble-Data-NonVRA.json' with { type: 'json' };
// GeoJSON data for district candidates (proposed districts)
// Until those data are available, they are resting for now
// import districtGaVra from './assets/ga/GA-Congress-District-VRA.json' with { type: 'json' };
import districtGaNonVra from './assets/ga/GA-Congress-District-NonVRA.json' with { type: 'json' };
// import districtIaVra from './assets/ia/IA-Congress-District-VRA.json' with { type: 'json' };
import districtIaNonVra from './assets/ia/IA-Congress-District-NonVRA.json' with { type: 'json' };
import boxGaCurrent from './assets/ga/GA-Box-Data-Current.json' with { type:'json' };
import boxIaCurrent from './assets/ia/IA-Box-Data-Current.json' with { type:'json' };
import ensembleGaCurrent from './assets/ga/GA-Ensemble-Data-Current.json' with { type: 'json' };
import ensembleIaCurrent from './assets/ia/IA-Ensemble-Data-Current.json' with { type: 'json' };

// GET - MainMenu
// Get the image of the 2 states
router.get('/', async (req,res)=>{
    try {
        const result = [ia,ga]
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

// GET - Gingles Chart

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


// ProposedVRAMap.jsx: Proposed GeoJSON, Ensemble Chart, Box and Whisker Chart
// Has VRA and NonVRA versions (for Voting Rights Act and Race Blind Redistricting respectively)

router.get('/ia/district-vra', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [districtIa,ensembleIaVra,boxIaVra]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ia/district-non-vra', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [districtIaNonVra,ensembleIaNonVra,boxIaNonVra]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-vra', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [districtGa,ensembleGaVra,boxGaVra]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-non-vra', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [districtGaNonVra,ensembleGaNonVra,boxGaNonVra]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
// TODO Later: Replace districtGa/districtGa on the 2nd and 3rd items to districtGaVra/districtGaNonVra
router.get('/ia/district-compare', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [districtIa,districtIa,districtIaNonVra]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-compare', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [districtGa,districtGa,districtGaNonVra]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ia/district-compare-chart', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [ensembleIaCurrent, boxIaCurrent, ensembleIaVra, boxIaVra, ensembleIaNonVra, boxIaNonVra]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-compare-chart', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [ensembleGaCurrent, boxGaCurrent, ensembleGaVra, boxGaVra, ensembleGaNonVra, boxGaNonVra]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
  

export default router;