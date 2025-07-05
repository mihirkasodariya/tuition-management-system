const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const {
  createNewBoardController,
  getSingleBoardDetailController,
  getBoardsListController,
  updateBoardController,
  deleteBoardController,
} = require("../../Controllers/board/board.controller");
const {
  createBoardValidation,
  listBoardsValidation,
  updateBoardValidation,
} = require("../../validators/boards/board.joi");
const { ADMIN } = require("../../Constants/roles.constants");

const BoardRoutes = express.Router();

BoardRoutes.route("/new-board").post(
  Authentication,
  Authorization(ADMIN),
  createBoardValidation,
  createNewBoardController
);

BoardRoutes.route("/list").get(
  // Authentication,
  // Authorization(ADMIN),
  listBoardsValidation,
  getBoardsListController
);

BoardRoutes.route("/:boardID")
  .get(Authentication, Authorization(ADMIN), getSingleBoardDetailController)
  .put(
    Authentication,
    Authorization(ADMIN),
    updateBoardValidation,
    updateBoardController
  )
  .delete(Authentication, Authorization(ADMIN), deleteBoardController);

module.exports = BoardRoutes;
