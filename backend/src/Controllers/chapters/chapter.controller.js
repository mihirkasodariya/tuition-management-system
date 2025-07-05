const httpErrors = require("http-errors");
const SUBJECT_CONSTANTS = require("../../Constants/subject.constants");
const logger = require("../../Config/logger.config");
const chapterModel = require("../../Schema/chapters/chapter.model");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");
const RedisServiceClass = require("../../Services/redis.service");

const updateChapterDetailsController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - chapters - chapter.controller - updateChapterDetailsController - Start"
    );

    const { chapterId } = req.params;

    let details = {
      ...req.body,
      updatedBy: req.user._id,
    };

    if (details?.subchapters) {
      details.subChapters = details?.subchapters?.map((item, index) => ({
        ...item,
        order: index,
      }));
      delete details.subchapters;
    }
    let data = await chapterModel.findByIdAndUpdate(
      chapterId,
      { $set: details },
      { new: true }
    );
    if (!data) {
      return next(
        httpErrors.NotFound("Chapter not  found with given chapterId")
      );
    }

    const redisService = new RedisServiceClass();
    await redisService.deletePattern("subjects:*");

    logger.info(
      "Controllers - chapters - chapter.controller - updateChapterDetailsController - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "successfully subject chapter is updated",
      data,
    });
  } catch (error) {
    logger.error(
      "Controllers - chapters - chapter.controller - updateChapterDetailsController  - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  updateChapterDetailsController,
};
