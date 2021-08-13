const { s3Upload } = require("../helpers/s3Uploader");

class SignatureController {
    postSignature(req, res, next) {
        s3Upload(req.body.base64String, 'signatures')
        .then(signatureFileId => {
            res.json({signatureFileId});
        })
        .catch(s3UploadError => {
            res.status(500).send(s3UploadError);
        });
    }
}

const signatureController = new SignatureController();
module.exports = signatureController;