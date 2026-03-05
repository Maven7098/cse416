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
// box and whisker charts for different racial/ethnic groups
import boxGaVraBlack from './assets/ga/GA-Box-Data-VRA-Black.json' with { type: 'json' };
import boxGaNonVraBlack from './assets/ga/GA-Box-Data-NonVRA-Black.json' with { type: 'json' };
import boxGaVraHispanic from './assets/ga/GA-Box-Data-VRA-Hispanic.json' with { type: 'json' };
import boxGaNonVraHispanic from './assets/ga/GA-Box-Data-NonVRA-Hispanic.json' with { type: 'json' };
import boxGaVraAsian from './assets/ga/GA-Box-Data-VRA-Asian.json' with { type: 'json' };
import boxGaNonVraAsian from './assets/ga/GA-Box-Data-NonVRA-Asian.json' with { type: 'json' };
import boxIaVraBlack from './assets/ia/IA-Box-Data-VRA-Black.json' with { type: 'json' };
import boxIaNonVraBlack from './assets/ia/IA-Box-Data-NonVRA-Black.json' with { type: 'json' };
import boxIaVraHispanic from './assets/ia/IA-Box-Data-VRA-Hispanic.json' with { type: 'json' };
import boxIaNonVraHispanic from './assets/ia/IA-Box-Data-NonVRA-Hispanic.json' with { type: 'json' };
import boxIaVraAsian from './assets/ia/IA-Box-Data-VRA-Asian.json' with { type: 'json' };
import boxIaNonVraAsian from './assets/ia/IA-Box-Data-NonVRA-Asian.json' with { type: 'json' };
// current box are for circles (current district racial distribution)
import boxGaCurrentBlack from './assets/ga/GA-Box-Data-Current-Black.json' with { type:'json' };
import boxIaCurrentBlack from './assets/ia/IA-Box-Data-Current-Black.json' with { type:'json' };
import boxGaCurrentHispanic from './assets/ga/GA-Box-Data-Current-Hispanic.json' with { type:'json' };
import boxIaCurrentHispanic from './assets/ia/IA-Box-Data-Current-Hispanic.json' with { type:'json' };
import boxGaCurrentAsian from './assets/ga/GA-Box-Data-Current-Asian.json' with { type:'json' };
import boxIaCurrentAsian from './assets/ia/IA-Box-Data-Current-Asian.json' with { type:'json' };
// ensemble data
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
        const result = [districtIa,ensembleIaVra]
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
        const result = [districtIaNonVra,ensembleIaNonVra]
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
        const result = [districtGa,ensembleGaVra]
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
        const result = [districtGaNonVra,ensembleGaNonVra]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ia/district-vra/box/black', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxIaVraBlack, boxIaCurrentBlack]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ia/district-non-vra/box/black', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxIaNonVraBlack, boxIaCurrentBlack]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-vra/box/black', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxGaVraBlack,boxGaCurrentBlack]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-non-vra/box/black', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxGaNonVraBlack,boxGaCurrentBlack]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ia/district-vra/box/hispanic', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxIaVraHispanic, boxIaCurrentHispanic]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ia/district-non-vra/box/hispanic', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxIaNonVraHispanic, boxIaCurrentHispanic]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-vra/box/hispanic', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxGaVraHispanic,boxGaCurrentHispanic]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-non-vra/box/hispanic', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxGaNonVraHispanic,boxGaCurrentHispanic]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ia/district-vra/box/asian', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxIaVraAsian, boxIaCurrentAsian]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ia/district-non-vra/box/asian', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxIaNonVraAsian, boxIaCurrentAsian]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-vra/box/asian', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxGaVraAsian,boxGaCurrentAsian]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-non-vra/box/asian', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxGaNonVraAsian,boxGaCurrentAsian]
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
        const result = [ensembleIaVra, ensembleIaNonVra]
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
        const result = [ensembleGaVra, ensembleGaNonVra]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
// Box Compare Charts based on racial/ethnic category
router.get('/ia/district-compare-chart/box/black', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxIaCurrentBlack, boxIaVraBlack, boxIaNonVraBlack]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-compare-chart/box/black', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxGaCurrentBlack, boxGaVraBlack, boxGaNonVraBlack]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ia/district-compare-chart/box/hispanic', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxIaCurrentHispanic, boxIaVraHispanic, boxIaNonVraHispanic]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-compare-chart/box/hispanic', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxGaCurrentHispanic, boxGaVraHispanic, boxGaNonVraHispanic]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ia/district-compare-chart/box/asian', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxIaCurrentAsian, boxIaVraAsian, boxIaNonVraAsian]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
router.get('/ga/district-compare-chart/box/asian', async (req,res)=>{
    try {
      // Send the GeoJSON file, latitude and longitude
        const result = [boxGaCurrentAsian, boxGaVraAsian, boxGaNonVraAsian]
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});
  

export default router;