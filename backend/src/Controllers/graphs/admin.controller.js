const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const userModel = require("../../Schema/users/user.model");
const { ADMIN, STUDENT } = require("../../Constants/roles.constants");
const errorHandling = require("../../Utils/errorHandling");
const moment = require("moment");
const { boards } = require("../../Constants/model.constants");

const adminDashboardGraphController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - graph.controller - AdminDashboardGraphController - Start"
    );
    const genderGraphAggregation = [
      { $match: { role: STUDENT } },
      { $group: { _id: "$gender", count: { $sum: 1 } } },
      { $project: { _id: 0, gender: "$_id", count: 1 } },
    ];
    const classWiseStudentsGraphAggregation = [
      { $match: { role: STUDENT } },
      { $group: { _id: "$class", count: { $sum: 1 } } },
      { $project: { _id: 0, classRoom: "$_id", count: 1 } },
    ];
    const boardWiseStudentsGraphAggregation = [
      { $match: { role: STUDENT } },
      { $group: { _id: "$boardType", count: { $sum: 1 } } },
      {
        $lookup: {
          from: boards,
          localField: "_id",
          foreignField: "_id",
          as: "board",
        },
      },
      {
        $project: {
          _id: 1,
          boardName: { $arrayElemAt: ["$board.name", 0] },
          count: 1,
        },
      },
    ];

    let genderGraphData = await userModel.aggregate(genderGraphAggregation);
    let classWiseStudentsGraphData = await userModel.aggregate(
      classWiseStudentsGraphAggregation
    );
    let boardWiseStudentsGraphData = await userModel.aggregate(
      boardWiseStudentsGraphAggregation
    );
    logger.info(
      "Controller - graph.controller - AdminDashboardGraphController - Start"
    );

    res.status(200).send({
      success: true,
      statusCode: 200,
      data: {
        genderGraphData,
        classWiseStudentsGraphData,
        boardWiseStudentsGraphData,
      },
    });
  } catch (error) {
    logger.error("Controller-user.controller-LoginUserController-Error", error);
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  adminDashboardGraphController,
};
