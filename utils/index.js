const constant = require("./constant");
const {
  getSearchAbleData,
  checkForMatch,
  getSearchType,
} = require("./search-util");
const token = require("./token");
const { camelize } = require("./helper");
const { getDate, addDate, updateFormat } = require("./time");
const { compare, hashPassword } = require("./hash");
const { generateOtp, messenger } = require("./message");
const {
  copyFiles,
  formidableUpload,
  uploadDocument,
  scanFile,
} = require("./upload");
const { sendMail } = require("./mail");
const uploadToSpaces = require("./upload-to-spaces");

module.exports = {
  token,
  getSearchAbleData,
  checkForMatch,
  getSearchType,
  constant,
  camelize,
  getDate,
  updateFormat,
  compare,
  hashPassword,
  addDate,
  generateOtp,
  copyFiles,
  sendMail,
  messenger,
  formidableUpload,
  uploadDocument,
  uploadToSpaces,
  scanFile,
};
