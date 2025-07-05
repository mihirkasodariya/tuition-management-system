const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const errorHandling = require("../../Utils/errorHandling");
const slugify = require("slugify");
const notesModel = require("../../Schema/notes/notes.schema");
const templateJsonData = require("./templates.json");
const { v4: uuidV4 } = require("uuid");

const createNewNoteController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - notes.controller - createNewNoteController - Start"
    );

    const { noteName, description } = req.body;
    const slug = slugify(noteName, { lower: true, strict: true });
    const isSlugPresent = await notesModel.findOne({ slug });
    if (isSlugPresent) {
      return next(httpErrors.BadRequest("slug is already available"));
    }

    let templateSections = templateJsonData?.[
      "template_1"
    ]?.templateSections?.map((section) => {
      return {
        ...section,
        uuid: uuidV4(),
        block: section?.block?.map((singleBlock) => {
          return {
            ...singleBlock,
            uuid: uuidV4(),
            subBlock: singleBlock?.subBlock?.map((singleSubBlock) => ({
              ...singleSubBlock,
              uuid: uuidV4(),
            })),
          };
        }),
      };
    });

    let details = {
      slug,
      title: noteName,
      description,
      templateSections,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };

    const newDetails = new notesModel(details);
    await newDetails.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "successfully new notes is created",
      data: newDetails,
    });

    logger.info(
      "Controller - notes.controller - createNewNoteController - End"
    );
  } catch (error) {
    logger.error(
      "Controller - notes.controller - createNewNoteController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getNotesDetailsController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - notes.controller - getNotesDetailsController - Start"
    );

    const { slug } = req.params;

    const note = await notesModel.findOne({ slug });
    if (!note) {
      return next(httpErrors.NotFound("Note not found"));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "successfully notes details is fetched",
      data: note,
    });

    logger.info(
      "Controller - notes.controller - getNotesDetailsController - End"
    );
  } catch (error) {
    logger.error(
      "Controller - notes.controller - getNotesDetailsController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const updateNoteController = async (req, res, next) => {
  try {
    logger.info("Controller - notes.controller - updateNoteController - Start");

    const { slug } = req.params;
    const updateData = req.body;

    if (updateData?.title) {
      const newSlug = slugify(updateData?.title, { lower: true, strict: true });
      let isSlugExist = await notesModel.findOne({ slug: newSlug });

      if (isSlugExist)
        return next(httpErrors.BadRequest("slug is already available"));

      updateData.slug = newSlug;
    }

    const note = await notesModel.findOneAndUpdate(
      { slug },
      { ...updateData, updatedBy: req.user._id },
      { new: true }
    );

    if (!note) return next(httpErrors.NotFound("Note not found"));

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Note updated successfully",
      data: note,
    });

    logger.info("Controller - notes.controller - updateNoteController - End");
  } catch (error) {
    logger.error(
      "Controller - notes.controller - updateNoteController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getNotesListController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - notes.controller - getNotesListController - Start"
    );

    let { limit = 15, page = 1, sort = "-createdAt" } = req.query;
    const { title = null, description = null } = req.query;

    limit = Number(limit);
    page = Number(page);

    const skip_docs = (page - 1) * limit;

    const query = {};
    if (title) query.title = { $regex: title, $options: "i" };
    if (description) query.description = { $regex: description, $options: "i" };

    const totalDocs = await notesModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    const docs = await notesModel
      .find(query)
      .skip(skip_docs)
      .limit(limit)
      .sort(sort);

    const hasNext = totalDocs > skip_docs + limit;
    const hasPrev = page > 1;

    const data = {
      totalDocs,
      totalPages,
      docs,
      currentPage: page,
      hasNext,
      hasPrev,
      limit,
    };

    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Notes list fetched successfully",
      data,
    });

    logger.info("Controller - notes.controller - getNotesListController - End");
  } catch (error) {
    logger.error(
      "Controller - notes.controller - getNotesListController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createNewNoteController,
  getNotesDetailsController,
  getNotesListController,
  updateNoteController,
};
