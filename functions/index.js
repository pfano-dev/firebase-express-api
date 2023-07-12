/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");

var admin = require("firebase-admin");

var serviceAccount = require("./permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");
const db = admin.firestore();
const app = express();

app.use(cors({ origin: true }));

app.get("/hello", (req, res) => {
  return res.status(200).send("hellow");
});

app.post("/create", async (req, res) => {
  try {
    await db.collection("products").doc(`/${req.body.id}/`).create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });
    return res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

app.post("/read/:id", async (req, res) => {
  try {
    const response = await db
      .collection("products")
      .doc(`/${req.params.id}/`)
      .get();

    return res.status(200).send(response.data());
  } catch (error) {
    console.log(error);
    return res.status(5000).send(error);
  }
});

exports.app = onRequest(app);
