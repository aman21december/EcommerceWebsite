const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { SPACES_KEY, SPACES_SECRET, BUCKET_NAME, SPACE_END_POINT } = require("./credentials");

const spacesEndpoint = new AWS.Endpoint(SPACE_END_POINT);
const s3 = new AWS.S3({
	endpoint: spacesEndpoint,
	accessKeyId: SPACES_KEY,
	secretAccessKey: SPACES_SECRET,
});

const uploadToSpaces = async (folderName, filePath, callback) => {
	const uploadParams = { Bucket: `${BUCKET_NAME}/${folderName}`, Body: "", ACL: "public-read" };
	const fileStream = fs.createReadStream(filePath);
	fileStream.on("error", error => {
		console.error(error);
		// throw new Error("Error in file");
	});
	uploadParams.Body = fileStream;
	uploadParams.Key = path.basename(filePath);

	const response = await s3.upload(uploadParams).promise();

	if (fs.existsSync(filePath)) {
		fs.unlink(filePath, error => {
			if (error) {
				console.error(error);
			}
			console.log("deleted");
		});
	}

	return response;
};

module.exports = uploadToSpaces;
