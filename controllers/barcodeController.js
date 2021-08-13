let db = require("../config/dbConfig");

class BarcodeController {
  addBarcode(req, res) {
    let barcode = req.params.barcode;
    let barcodeContentData = { barcode };
    let barcodeContentTallyQuery = "INSERT INTO  barcodes_table SET ?";
    db.query(barcodeContentTallyQuery, barcodeContentData, (err, result) => {
      if (err) {
        throw err;
      }
      console.log(barcode);
      res.send("done");
    });
  }

  searchBarcode(req, res) {
    let barcode = req.params.barcode;
    console.log("barcode be ", barcode);
    let query = `SELECT barcode FROM barcodes_table WHERE barcode = '${barcode}' `;
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      }
      console.log("Result isss ", result);
      res.send(result[0]);
    });
  }
}

const barcodeController = new BarcodeController();
module.exports = barcodeController;
