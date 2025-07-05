const moment = require("moment");
const attendanceModel = require("../Schema/attendance/attendance.model");
const GoogleCalendarServiceClass = require("./google.calendar.service");
const NodeMailerServiceClass = require("../aws_ses/mails/mail.index");
const enrollmentProgressModel = require("../Schema/enrollment-progress/enrollmentProgress.model");

class LiveClassServiceClass {
  constructor(
    studentId,
    studentDetails,
    startTime,
    endTime,
    summary,
    description,
    batchId,
    userId
  ) {
    this.studentId = studentId;
    this.studentDetails = studentDetails;
    this.currentDay = moment().format("dddd").toLowerCase();
    this.summary = summary || null;
    this.description = description || null;
    this.startDate = moment(startTime, "HH:mm");
    this.endDate = moment(endTime, "HH:mm");
    this.googleMeet = null;
    this.batchId = batchId;
    this.userId = userId;
    this.enrollment = null;
  }

  async checkAvailabilityMethod() {
    const existingRecord = await attendanceModel.findOne({
      student: this.studentId,
      startDate: this.startDate,
    });
    return existingRecord;
  }

  async createGoogleMeetMethod() {
    try {
      const googleCalendarService = await new GoogleCalendarServiceClass(
        this.userId
      );

      let googleEventDetails = {
        summary: this.summary,
        description: this.description,
        startDate: this.startDate,
        endDate: this.endDate,
        timezone: "Asia/Kolkata",
        location: "Google Meet",
        attendees: [{ email: this.studentDetails.email }],
      };

      await googleCalendarService.initialize();
      let eventResponseDetails = await googleCalendarService.createEvent(
        "primary",
        googleEventDetails
      );

      if (eventResponseDetails) {
        this.googleMeet = {
          meetLink: eventResponseDetails.hangoutLink,
          conferenceId: eventResponseDetails.conferenceData.conferenceId,
          details: eventResponseDetails,
        };
      }

      return this.googleMeet;
    } catch (error) {
      throw error;
    }
  }

  async getEnrollmentId() {
    let data = await enrollmentProgressModel
      .findOne({
        studentId: this.studentId,
        batch: this.batchId,
      })
      .lean();

    if (data) {
      this.enrollment = data._id;
      return data;
    }
    return null;
  }

  async createMeetDocument() {
    let details = {
      student: this.studentId,
      summary: this.summary,
      description: this.summary,
      startDate: this.startDate,
      endDate: this.endDate,
      day: this.currentDay,
      class: this.studentDetails?.class,
      enrollment: this.enrollment,
      board: this.studentDetails?.boardType.toString(),
      batch: this.batchId,
      createdBy: this.userId,
      updatedBy: this.userId,
      googleMeet: this.googleMeet,
    };

    const data = new attendanceModel(details);
    await data.save();
    return data;
  }

  async sendMailMethod() {
    let mailDetails = {
      student_name: this.studentDetails?.name,
      session_summary: this.summary,
      session_description: this.description,
      session_date: moment(this.startDate).format("LLL"),
      session_time:
        moment(this.startDate).format("hh:mm A") +
        " - " +
        moment(this.endDate).format("hh:mm A"),
      session_meet_link: this.googleMeet.meetLink,
    };

    const nodeMailerService = new NodeMailerServiceClass();
    await nodeMailerService.sendMail(
      this.studentDetails.email,
      "liveSessionReminderTemplate",
      null,
      mailDetails
    );
  }
}

module.exports = LiveClassServiceClass;
