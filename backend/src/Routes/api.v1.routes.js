const express = require("express");
const UserRoutes = require("./users/user.routes");
const BoardRoutes = require("./board/board.routes");
const SubjectRoutes = require("./subject/subject.routes");
const BatchRoutes = require("./batch/batch.routes");
const EnrollmentRoutes = require("./enrollment-progress/enrollment.routes");
const AttendanceRoutes = require("./attendance/attendance.route");
const GraphRoutes = require("./graphs/grahph.route");
const ContactFormRoutes = require("./contact/contact.route");
const StudentAttendanceRoutes = require("./attendance/studentAttendance.route");
const StudentEnrollmentRoutes = require("./enrollment-progress/studentEnrollment.routes");
const AiRoutes = require("./ai/ai.routes");
const NoteRoutes = require("./notes/notes.routes");
const NotificationRoutes = require("./notifications/notification.routes");
const HomeworkRoutes = require("./homework/homework.routes");
const StudentHomeworkRoutes = require("./homework/studentHomework.routes");

// Route config
const ApiV1Routes = express.Router();

// ----------------------------------------
//  user  routes
// ----------------------------------------
ApiV1Routes.use("/user", UserRoutes);

// ----------------------------------------
//  board  routes
// ----------------------------------------
ApiV1Routes.use("/board", BoardRoutes);

// ----------------------------------------
//  subject  routes
// ----------------------------------------
ApiV1Routes.use("/subject", SubjectRoutes);

// ----------------------------------------
//  Batches  routes
// ----------------------------------------
ApiV1Routes.use("/batch", BatchRoutes);

// ----------------------------------------
//  Enrollment- Progress  routes
// ----------------------------------------
ApiV1Routes.use("/enrollment", EnrollmentRoutes);
ApiV1Routes.use("/student-enrollment", StudentEnrollmentRoutes);

// ----------------------------------------
//  Attendance  routes
// ----------------------------------------
ApiV1Routes.use("/attendance", AttendanceRoutes);
ApiV1Routes.use("/student-attendance", StudentAttendanceRoutes);

// ----------------------------------------
//  Graph routes
// ----------------------------------------
ApiV1Routes.use("/graph", GraphRoutes);

// ----------------------------------------
//  Contact-Forms routes
// ----------------------------------------
ApiV1Routes.use("/contact", ContactFormRoutes);

// ----------------------------------------
//  Ai routes
// ----------------------------------------
ApiV1Routes.use("/ai", AiRoutes);

// ----------------------------------------
//  Ai routes
// ----------------------------------------
ApiV1Routes.use("/notes", NoteRoutes);

// Notifications
ApiV1Routes.use("/notifications", NotificationRoutes);

// Homework
ApiV1Routes.use("/homework", HomeworkRoutes);
ApiV1Routes.use("/student-homework", StudentHomeworkRoutes);

// export the routes
module.exports = ApiV1Routes;
