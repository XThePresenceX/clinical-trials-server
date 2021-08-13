let db = require('../config/dbConfig');

class StudyProductModel {
  getStudyProducts(success, failure) {
    db.query('SELECT sp.id, sp.studyId, sp.productId, p.name as productName FROM study_products sp JOIN products p ON sp.productId = p.id', (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.length > 0) {
        return success(rows);
      }
      return success([]);
    });
  }

  deleteStudyProducts(studyProductId, success, failure) {
    db.query('DELETE FROM study_products WHERE id = ?', [studyProductId], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      return success(true);
    });
  }

  postStudyProducts(studyId, productId, success, failure) {
    db.query('INSERT INTO study_products (studyId, productId) VALUES (?,?)',
    [studyId, productId], (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }
      if (rows.affectedRows === 1) {
        return success({
          id: rows.insertId,
          studyId: studyId,
          productId: productId
        });
      }
      return failure(`Unable to add product with id - ${productId} to study id ${studyId} into the database`);
    });
  }
}

const studyProductModel = new StudyProductModel()
module.exports = studyProductModel;
