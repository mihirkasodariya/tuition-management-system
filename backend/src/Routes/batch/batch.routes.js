const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const {
  createNewBatchController,
  getBatchesListController,
} = require("../../Controllers/batch/batch.controller");
const {
  createBatchValidation,
  listBatchesValidation,
} = require("../../validators/batches/batch.joi");
const { ADMIN } = require("../../Constants/roles.constants");

const BatchRoutes = express.Router();

BatchRoutes.route("/new-batch").post(
  Authentication,
  Authorization(ADMIN),
  createBatchValidation,
  createNewBatchController
);

BatchRoutes.route("/list").get(
  Authentication,
  Authorization(ADMIN),
  listBatchesValidation,
  getBatchesListController
);

module.exports = BatchRoutes;
