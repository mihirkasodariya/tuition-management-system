const httpErrors = require("http-errors");
const SUBJECT_CONSTANTS = require("../../Constants/subject.constants");
const logger = require("../../Config/logger.config");
const subjectModel = require("../../Schema/subject/subject.model");
const chapterModel = require("../../Schema/chapters/chapter.model");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");
const RedisServiceClass = require("../../Services/redis.service");
const { generateSubjectListCacheKey } = require("../../Utils/redis.utils");

const createNewSubjectController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - subject - subject.controller - createNewSubjectController - Start"
    );

    let { name, description, code, classRoom, boardType, chapters } = req.body;
    let details = {
      name,
      code,
      class: classRoom,
      boardType,
      batch: req.batch._id,
      description: description ?? "this subject is about " + name,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };
    const existingSubject = await subjectModel.findOne({
      name: name.toLowerCase(),
      code,
      class: classRoom,
      boardType,
      batch: req.batch._id,
    });
    if (existingSubject) {
      return next(
        httpErrors.BadRequest(
          SUBJECT_CONSTANTS.SUBJECT_ALREADY_EXISTS +
            "with given class and Board"
        )
      );
    }

    let subjectData = new subjectModel(details);
    await subjectData.save();

    let chaptersArray = chapters?.map((singleChapter, order) => {
      let singleChapterDetails = {
        title: singleChapter?.title || "",
        content: singleChapter?.content || "",
        imageURL: singleChapter?.imageURL || "",
        subject: subjectData?._id,
        order: order,
        createdBy: req.user._id,
        updatedBy: req.user._id,
        batch: req.batch._id,
      };

      let subChapterDetails = singleChapter?.subchapters?.map(
        (singleSubChapter, subOrder) => {
          let newDetails = {
            title: singleSubChapter?.title || "",
            content: singleSubChapter?.content || "",
            imageURL: singleSubChapter?.imageURL || "",
            order: subOrder,
          };
          return newDetails;
        }
      );

      singleChapterDetails.subChapters = subChapterDetails;

      return singleChapterDetails;
    });

    let insertedChapters = await chapterModel.insertMany(chaptersArray);

    // Extract the IDs of the newly created chapters
    const chapterIds = insertedChapters.map((chapter) => chapter._id);

    // Update the subject with the new chapter IDs
    let finalData = await subjectModel.findByIdAndUpdate(
      subjectData._id,
      { $set: { chapters: chapterIds } },
      { new: true }
    );

    const redisService = new RedisServiceClass();
    await redisService.deletePattern("subjects:*");

    logger.info(
      "Controllers - subject - subject.controller - createNewSubjectController- End"
    );
    res.status(201).send({
      success: true,
      statusCode: 201,
      message: SUBJECT_CONSTANTS.SUCCESSFULLY_SUBJECT_CREATED,
      data: finalData,
    });
  } catch (error) {
    logger.error(
      "Controllers - subject - subject.controller - createNewSubjectController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getSingleSubjectDetailController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - subject - subject.controller - getSingleSubjectDetailController - Start"
    );

    const { subjectID } = req.params;
    const subjectData = await subjectModel
      .findById(subjectID)
      .populate("createdBy updatedBy boardType batch", "name")
      .populate("chapters")
      .lean();

    if (!subjectData) {
      return next(httpErrors.NotFound(SUBJECT_CONSTANTS.SUBJECT_NOT_FOUND));
    }

    logger.info(
      "Controllers - subject - subject.controller - getSingleSubjectDetailController - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: SUBJECT_CONSTANTS.SUCCESSFULLY_SUBJECT_DETAILS_FETCHED,
      data: subjectData,
    });
  } catch (error) {
    logger.error(
      "Controllers - board - board.controller - getSingleSubjectDetailController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getSubjectsListController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - subject - subject.controller - getSubjectsListController - Start"
    );

    const { sort, classRoom, boardType, name, batch } = req.query;
    const query = {};

    if (classRoom) query.class = Number(classRoom);
    if (boardType) query.boardType = boardType;
    if (name) query.name = { $regex: name, $options: "i" };
    if (batch) query.batch = batch;

    let sortQuery = sortConstants["-createdAt"];
    if (sort) {
      sortQuery = sortConstants[sort];
    }

    let subjectData = null;
    const cacheKey = generateSubjectListCacheKey({
      sort,
      classRoom,
      boardType,
      name,
      batch,
      userId: req.user?._id, // Include user ID if you have user-specific data
    });
    const redisService = new RedisServiceClass();
    const cachedData = await redisService.getRedisJSON(cacheKey);
    if (cachedData) {
      subjectData = cachedData;
    } else {
      subjectData = await subjectModel
        .find(query)
        .populate("createdBy updatedBy boardType batch", "name")
        .sort(sortQuery)
        .lean();

      await redisService.setRedisJSON(cacheKey, subjectData);
    }

    logger.info(
      "Controllers - subject - subject.controller - getSubjectsListController - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: SUBJECT_CONSTANTS.SUCCESSFULLY_SUBJECT_LIST_FETCHED,
      data: subjectData,
    });
  } catch (error) {
    logger.error(
      "Controllers - subject - subject.controller - getSubjectsListController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const updateSubjectController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - subject - subject.controller - updateSubjectController - Start"
    );

    const { subjectID } = req.params;
    const { name, description, code } = req.body;

    let detailsToUpdate = {
      updatedBy: req.user._id,
    };

    if (name) detailsToUpdate.name = name;
    if (description) detailsToUpdate.description = description;
    if (code) detailsToUpdate.code = code;

    const subjectData = await subjectModel
      .findByIdAndUpdate(subjectID, { $set: detailsToUpdate }, { new: true })
      .populate("createdBy updatedBy", "name")
      .lean();

    if (!subjectData) {
      return next(httpErrors.NotFound(SUBJECT_CONSTANTS.SUBJECT_NOT_FOUND));
    }

    const redisService = new RedisServiceClass();
    await redisService.deletePattern("subjects:*");

    logger.info(
      "Controllers - subject - subject.controller - updateSubjectController - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: SUBJECT_CONSTANTS.SUCCESSFULLY_SUBJECT_UPDATED,
      data: subjectData,
    });
  } catch (error) {
    logger.error(
      "Controllers - subject - subject.controller - updateSubjectController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const deleteSubjectController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - subject - subject.controller - deleteSubjectController - Start"
    );

    const { subjectID } = req.params;

    const subjectData = await subjectModel.findByIdAndDelete(subjectID);

    if (!subjectData) {
      return next(httpErrors.NotFound(SUBJECT_CONSTANTS.SUBJECT_NOT_FOUND));
    }

    const redisService = new RedisServiceClass();
    await redisService.deletePattern("subjects:*");

    logger.info(
      "Controllers - subject - subject.controller - deleteSubjectController - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: SUBJECT_CONSTANTS.SUCCESSFULLY_SUBJECT_DELETED,
    });
  } catch (error) {
    logger.error(
      "Controllers - subject - subject.controller - deleteSubjectController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createNewSubjectController,
  getSingleSubjectDetailController,
  getSubjectsListController,
  updateSubjectController,
  deleteSubjectController,
};
