let path = require('path');
let fs = require('fs');

class FileHandler {
  uploadFile(fileObj, callBack) {
    let destination_path = fileObj.destination_path;
    let file_param_name = fileObj.file_param_name;
    let allowed_extensions = fileObj.allowed_extensions;
    let original_file = fileObj.original_file;
    let responseObj = {};
    let ext = path.extname(original_file.name);
    let file_name = file_param_name + '-' + Date.now() + ext;

    if(allowed_extensions.indexOf(ext.toLowerCase()) == -1) {
      responseObj = {success : 0, message : "INVALID_FILE"};
      return callBack(responseObj);
    }

    original_file.mv(destination_path + file_name, (err) => {
      if (err)
        responseObj = {success : 0, message : err.error, error : err};
      else
        responseObj = {success : 1, message : 'Success', file_name : file_name};
      return callBack(responseObj);
    });
  }
}

const fileHandler = new FileHandler();
module.exports = fileHandler;
