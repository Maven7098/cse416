// This is CommonJS format.
// As React uses ECMAScript, I will use ECMAScript for the others as well
// const express = require()
import express from 'express';
import Joi from 'joi';

// These 2 will be used as dummies before MySQL comes online
// import facilities from '../assets/Facility_Data.json'
// import users from '../assets/users.json';
import mysql from 'mysql2';
let router = express.Router();

// MySQL calls
// For Facilities
// GET
import mysql_getFacilities from './sql_getFacilities.js';
// import mysql_getFacility from './sql_getFacility.js';
// POST - May not be needed
// import mysql_addFacilities from './sql_addFacilities.js';
// PUT - May not be needed
// import mysql_modFacilities from './sql_modFacilities.js';
// DELETE - May not be needed
// import mysql_delFacilities from './sql_delFacility.js'

// For Reservations
// GET
import mysql_getReserves from './sql_getReserves.js';
// POST
import mysql_addReserve from './sql_addReserve.js';
// PUT - May not be needed
// import mysql_modReserve from './sql_modReserve.js';
// DELETE
import mysql_delReserve from './sql_delReserve.js';

// Shared MySQL open
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pass4root",
  database: "cse316_assignment3"
});

// // For Users
// // GET
// import mysql_getUser from './sql_getUser.js';
// // POST - May not be needed
// import mysql_addUser from './sql_addUser.js';
// // PUT
// import mysql_modUser from './sql_modUser.js';
// // DELETE
// import mysql_delUser from './sql_delUser.js';

// GET - facilities
// Get the facility list
router.get('/facilities', async (req,res)=>{
    try {
        const result = await mysql_getFacilities(con)
        res.send(result)
      } catch (err) {
        res.status(500).send({
          success: false,
          error: err,
        })
      }
});

// Get information about individual facility
// router.get('/facilities/:id', async (req,res)=>{
//     try {
//         // Find the facility with the matching ID
//         const result = await mysql_getFacility(con, req.params.id);
//         // If the facility is not found, return 404
//         if(!result){
//             res.status(404).send('The facility with given id was not found.');
//             return;
//         }
//         res.send(result)
//       } catch (err) {
//         res.status(500).send({
//           success: false,
//           error: err,
//         })
//       }
// });

// POST - faciliites
// I did not modify any of the values here in order to ensure interoperability with the front-end (same goes for PUT)
// router.post('/facilities', (req,res)=>{
//     // Instantiate newFacility object
//     // Note that req.body.days start as an array, but I need to replace that with the String
//     const days = JSON.stringify(req.body.days).slice(1,this.length-1)
//     mysql_addFacilities(req.body.title, req.body.description, req.body.image, days, req.body.capacityMin, req.body.capacityMax, req.body.location, req.body.suny)

//     // Push new facility to facilities to finish
//     // res.post(newFacility);
// });

// PUT - facilities
// router.put('/facilities/:id', (req,res)=>{
//     // Instantiate newFacility object
//     mysql_modFacilities(req.body.id, req.body.title, req.body.description, req.body.image, req.body.days, req.body.capacityMin, req.body.capacityMax, req.body.location, req.body.suny)
    
//     // // Push newFacility to facilities to finish
//     // res.post(newFacility);
// });

// DELETE - facilities
// router.delete('/facilities/:id', (req,res)=>{
//     mysql_delFacilities(req.body.id);
//     // // Find the facility with the matching ID
//     // const facility = facilities.find((facility) => facility.id === parseInt(req.params.id));

//     // // If the facility is not found, return 404
//     // if (!facility) {
//     //     res.status(404).send('The course with given id was not found.');
//     // };
    
//     // // Else, find the facility in question among facilities
//     // const index = facilities.indexOf(facility);
//     // // Delete the facility in facilities
//     // facilities.splice(index, 1);
    
//     // res.send(facility);
// });

// Now do the same for the reservations as well

// GET - reservation
// Get the reservation list
router.get('/reserves', async (req,res)=>{
  try {
      const result = await mysql_getReserves(con)
      res.send(result)
    } catch (err) {
      res.status(500).send("Error: "+err);
    }
});

// Get information about individual reservation
// router.get('/reserves/:id', (req,res)=>{
//     // Find the reservation with the matching ID
//     const reserve = reserves.find((reserve) => reserve.id === parseInt(req.params.id));

//     // If the facility is not found, return 404
//     if (!facility) {
//         res.status(404).send('The course with given id was not found.');
//     };

//     // Else, return the facility in question
//     res.send(facility);
// });

// POST - reservations
// router.post('/facilities', (req,res)=>{
//     // Instantiate newReserve object
//     const newReserve = {
//         id: facilities.length + 1,
//         title: req.body.title,
//         description: req.body.description,
//         image: req.body.image,
//         days: req.body.days,
//         capacityMin: req.body.capacityMin,
//         capacityMax: req.body.capacityMax,
//         location: req.body.location,
//         suny: req.body.suny
//     }

//     // Push new reservation to reservations to finish
//     res.post(newReserve);
// });
router.post('/reserves', async (req,res)=>{
  try {
    let reserve={
      // For some reason, when forms are submitted this way, the brackets come off
      // "'" was added for strings and the date type for this reason
      reserveDate: "'"+req.body.reserveDate+"'",
      reserveCap: req.body.reserveCap,
      reservePurpose: "'"+req.body.reservePurpose+"'",
      facilityId: req.body.facilityId,
      userId: req.body.userId
    }
    // const middle = validateReserve(con, reserve);
    // if (middle.error) {
    //     res.status(400).send(middle.error.details[0].message);
    //     return;
    // }
    console.log(reserve);
    const result = await mysql_addReserve(con, reserve);
    res.send(result)
  } catch (err) {
    res.status(500).send("Error: "+err)
  }
    // Instantiate newFacility object
    

    // Push new facility to facilities to finish
    // res.post(newFacility);
});

// PUT - reservations
// router.put('/reserves/:id', (req,res)=>{
//     // Instantiate newFacility object
//     mysql_modReserve(req.body.reserveId, req.body.reserveDate,req.body.reserveCap,req.body.reservePurpose,req.body.facilityId,req.body.userId)
    
//     // // Push newFacility to facilities to finish
//     // res.post(newFacility);
// });

// DELETE - reservations
// router.delete('/reserves/:id', (req,res)=>{
//     // Find the reservation with the matching ID
//     const reserve = reserves.find((reserve) => reserve.id === parseInt(req.params.id));

//     // If the facility is not found, return 404
//     if (!reserve) {
//         res.status(404).send('The course with given id was not found.');
//     };
    
//     // Else, find the reservation in question among reservations
//     const index = reserves.indexOf(reserve);
//     // Delete the reservation in reservations
//     reserves.splice(index, 1);
    
//     res.send(reserve);
// });
router.delete('/reserves/:id', async (req,res)=>{
  try {
    const result = await mysql_delReserve(con, req.params.id);
    res.send(result)
  } catch (err) {
    res.status(500).send("Error: "+err)
  }
})

// Backend schema to validate facility
// Currently unused since there is no PUT nor post in facilities
function validateFacility(facility){
    // Scheme to validate user
    // Taken from "https://joi.dev/api/?v=17.13.3"
    const schema = Joi.object({
        title: Joi.string()
        .alphanum()
        .min(3)
        .max(64)
        .required(),
        description: Joi.string().alphanum().min(3).max(256),
        // Array of days, max is all 7 days of the week
        // Taken from https://joi.dev/api/?v=17.13.3#array and https://joi.dev/api/?v=17.13.3#anyvalidvalues---aliases-equal
        days: Joi.array().items(Joi.string().min(1).max(7).valid("Mon","Tue","Wed","Thu","Fri","Sat","Sun")),
        capacityMin: Joi.number().required(),
        capacityMax: Joi.number().required(),
        // Because MySQL does not have a boolean data type
        location:Joi.string().max(16),
        // 0 is FALSE and 1 is TRUE
        // Only 0 or 1 are allowed
        suny: Joi.number().valid(0,1).default(0)
    });
    return schema.validate(facility);
}

// Backend schema to validate reservation
function validateReserve(reserve){
  // Scheme to validate user
  // Taken from "https://joi.dev/api/?v=17.13.3"
  console.log(reserve);
  const schema = Joi.object({
    // 2024-04-04 (YYYY-MM-DD format)
    // Taken from https://stackoverflow.com/questions/22061723/regex-date-validation-for-yyyy-mm-dd#22061879
    // But the front and back ' are added to prevent the ""'s to detach while being passed to SQL
    reserveDate:Joi.string().pattern(new RegExp("^'\\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])'\$")),
    // This should also get the facilityId->capacityMax and capacityMin
    reserveCap:Joi.number(),
    // Can this be left blank?
    reservePurpose: Joi.string(),
    // This is sent from the form.
    facilityId: Joi.number().required(),
    // How can I get what user is using the service at the present?
    userId:Joi.number().required()
  });
  return schema.validate(reserve);
}

// // Future-proofing (?)
// // GET - user
// // But I am not interested in getting a list of users. Not now yet
// router.get('/users/:id', (req,res)=>{
//     const user = users.find((user) => user.id === parseInt(req.params.id));
//     // Not found - 404
//     (!user ?
//         res.status(404).send('User with given ID not found') :
//         res.send(user));
// })

// // POST - user
// // For non-GET calls, things should change once MySQL comes online.
// // Let's write a pseudocode for now
// router.post('/users', (req,res)=>{
//     // Validate new user
//     const result = validateUser(req.body);
    
//     // Throw 400 if new user is invalid 
//     if(result.error){
//         res.status(400).send(result.error.details[0].message);
//         return;
//     }

//     // Instantiate new user object to be pushed
//     const newUser = {
//         userId: users.length + 1,
//         userName: req.body.name,
//         userPasswd: req.body.passwd,
//         userEmail: req.body.email,
//         userImage: "./AssignImages/user.png"
//     }
//     // Push new user to users to finish
//     users.push(newUser);
//     res.send(newUser);
// })

// // PUT - user
// router.put('/users/:id', (req, res) => {
//     // Find the user with a matching ID
//     const user = users.find((user) => user.id === parseInt(req.params.id));
//     console.log(user);

//     // If user is not found, return 404
//     if (!user) {
//         res.status(404).send('The course with given id was not found.');
//     };

//     // Else validate user
//     const result = validateUser(req.body);

//     // If modified user data is invalid, throw 400
//     if (result.error) {
//         res.status(400).send(result.error.details[0].message);
//         return;
//     }

//     // Instantiate a new user object
//     const newUser = {
//         userId: users.length + 1,
//         userName: req.body.name,
//         userPasswd: req.body.passwd,
//         userEmail: req.body.email,
//         userImage: "./AssignImages/user.png"
//     }

//     // Push new user to users to finish
//     res.send(newUser);    
// });

// // DELETE - user

// // Function to validate new or edited users
// function validateUser(user){
//     // Scheme to validate user
//     // Taken from "https://joi.dev/api/?v=17.13.3"
//     const schema = Joi.object({
//         name: Joi.string()
//         .alphanum()
//         .min(3)
//         .max(30)
//         .required(),
//         passwd: Joi.string()
//         .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
//         email: Joi.string()
//         .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
//         image: Joi.string()
//     });
//     return schema.validate(user);
// }

export default router;