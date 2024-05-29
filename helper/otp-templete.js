const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

//To fetch template for otp
module.exports = {
  /**
   * @param {string} templateType
   * @returns {string} Message For OTP
   */
  fetchOtpTemplate: async (templateType) => {
    const [template] = await sequelize.query(
      "SELECT * FROM `otp_template` where template_type = ? AND status = ?",
      {
        type: QueryTypes.SELECT,
        replacements: [templateType, "Active"],
      }
    );

    return {
      DLT: template.dlt,
      mailSubject: template.template_email_subject,
      mail: template.template_message_email,
      phone: template.template_message,
    };
  },
};
