const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const { ADMIN } = require("../../Constants/roles.constants");
const {
  createNewNoteController,
  getNotesDetailsController,
  getNotesListController,
  updateNoteController,
} = require("../../Controllers/notes/notes.controller");
const {
  createNewNotesValidation,
  notesListValidation,
  notesUpdateValidation,
} = require("../../validators/notes/notes.validation");

const NoteRoutes = express.Router();

NoteRoutes.route("/create-new-note").post(
  Authentication,
  Authorization(ADMIN),
  createNewNotesValidation,
  createNewNoteController
);
NoteRoutes.route("/notes-list").get(
  notesListValidation,
  getNotesListController
);
NoteRoutes.route("/:slug")
  .get(getNotesDetailsController)
  .put(
    Authentication,
    Authorization(ADMIN),
    notesUpdateValidation,
    updateNoteController
  );

module.exports = NoteRoutes;
