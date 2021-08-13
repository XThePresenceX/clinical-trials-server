const AWS = require('aws-sdk');
var s3 = new AWS.S3({
    params: { Bucket: process.env.AWS_BUCKET_NAME }
});
const { v4: uuidv4 } = require('uuid');

module.exports.s3Upload = (content, folder) => {
    return new Promise((resolve, reject) => {
        const key = uuidv4();
        const buffer = Buffer.from(content, 'base64');
        const data = {
            Key: `${folder}/${key}`,
            Body: buffer,
            ContentType: folder === "signatures" ? 'image/png' : 'image/jpeg'
        };
        s3.upload(data, function (s3UploadError, data) {
            if (s3UploadError) {
                console.log(s3UploadError);
                reject("There was an error uploading the file")
            } else {
                console.log("success");
                resolve(key);
            }
        });
    });
}
