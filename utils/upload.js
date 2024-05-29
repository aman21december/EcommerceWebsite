const util = require("util");
const fs = require("fs");
const formidable = require("formidable");
const copyFilePromise = util.promisify(fs.copyFile);
const NodeClam = require("clamscan");

let scanFile = async (filePath) => {
  if (process.env.VIRUS_CHECKER == "OFF") return true;
  const clamscan = await new NodeClam().init({
    remove_infected: true,
    debug_mode: false,
    scan_recursively: false,
    clamdscan: {
      socket: process.env.CLAMDSCAN_SOCKET || "/var/run/clamav/clamd.ctl",
      timeout: 120000,
      local_fallback: true,
      path: process.env.CLAMDSCAN_PATH || "/var/lib/clamav",
      config_file:
        process.env.CLAMDSCAN_CONFIG_FILE || "/etc/clamav/clamd.conf",
    },
  });

  const { is_infected, viruses } = await clamscan.scan_file(filePath);

  if (is_infected) {
    console.error(`Virus scan failed, file INFECTED`, { filePath, viruses });
  } else {
    console.log(`Virus scan OK`, { filePath });
  }

  return is_infected;
};

const copyFiles = (srcDir, destDir, dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return copyFilePromise(srcDir, destDir);
};

const formidableUpload = async (req) => {
  try {
    const form = new formidable.IncomingForm();
    console.log(form.parse);
    form.keepExtensions = true;
    form.on("error", (e) => console.log(e));
    form.on("aborted", () => console.log("aborted"));
    form.multiples = true;
    const formfields = await new Promise(function (resolve, reject) {
      form.parse(req, function (err, fields, files) {
        if (err) {
          reject(err);
          return;
        }

        resolve({ fields, files });
      }); // form.parse
    });

    return formfields;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  formidableUpload,
  scanFile,
  copyFiles,
};
