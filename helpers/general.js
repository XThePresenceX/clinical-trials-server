class General {
  verifyRequiredParams(receivedParameters, res, paramsToCheck) {
    for (let i = 0; i < paramsToCheck.length; i++) {
      let parameter = receivedParameters[paramsToCheck[i]];
      if (parameter === "" || parameter === null || parameter === undefined) {
        console.log(
          "Parameter issues: ",
          parameter,
          receivedParameters[i],
          paramsToCheck[i]
        );
        res.status(400).json({
          message: "Invalid Request Body. Missing Required Parameters.",
        });
        return false;
      }
    }
    return true;
  }

  verifySocketParams(receivedParameters, paramsToCheck, callBack) {
    for (let i = 0; i < paramsToCheck.length; i++) {
      let parameter = receivedParameters[paramsToCheck[i]];
      if (parameter === "" || parameter === null || parameter === undefined) {
        return callBack(false);
      }
    }
    return callBack(true);
  }

  is_string(value) {
    if (typeof value === "string") {
      return true;
    } else {
      return false;
    }
  }

  validate_email(email, callback) {
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    console.log(emailRegexp.test(email));
    if (emailRegexp.test(email)) {
      callback(true);
    } else {
      callback(false);
    }
  }

  addslashes(string) {
    return string
      .replace(/\\/g, "\\\\")
      .replace(/\u0008/g, "\\b")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\f/g, "\\f")
      .replace(/\r/g, "\\r")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"');
  }
}

const general = new General();
module.exports = general;
