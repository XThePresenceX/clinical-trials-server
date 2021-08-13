let db = require('../config/dbConfig');

class ProductModel {
  getProducts(success, failure) {
    db.query('SELECT p.id, p.name, p.description, p.barcodeNumber, group_concat(pi.url) as urls FROM products p '
    + 'left join product_images pi on p.id = pi.productId GROUP BY p.id, p.name, p.description, p.barcodeNumber',
    (err, rows, status) => {
      if(err) {
        return failure(err);
      }
      if(rows.length > 0) {
        rows.forEach(row => {
          if(row.urls) {
            row.urls = row.urls.split(',');
          } else {
            row.urls = [];
          }
        });
        return success(rows);
      }
      return success([]);
    });
  }

  addProduct(body, success, failure) {
    db.query('INSERT INTO products(name, description, barcodeNumber) VALUES(?,?,?)',
      [body.name, body.description, body.barcodeNumber], (err, rows, status) => {
      if(err) {
        return failure(err);
      }
      if(rows.affectedRows > 0) {
        body['id'] = rows.insertId;
        return success(body);
      }
      return failure('Unable to insert into DB');
    });
  }

  putProduct(productId, body, success, notFound, failure) {
    db.query('UPDATE products SET name = ?, description = ?, barcodeNumber = ? WHERE id = ?',
      [body.name, body.description, body.barcodeNumber, productId], (err, rows, status) => {
      if(err) {
        return failure(err);
      }
      if(rows.affectedRows > 0) {
        body['id'] = productId;
        return success(body);
      }
      return notFound(true);
    });
  }

  deleteProduct(productId, success, failure) {
    db.query('DELETE FROM products WHERE id = ?', [productId], (err, rows, status) => {
      if(err) {
        return failure(err);
      }
      return success(true);
    });
  }

  addImages(productId, urls, success, failure) {
    if (!urls || urls.length === 0) {
      return success(true);
    }
    let values = '';
    urls.forEach(url => {
      if (values !== ''){
        values+=',';
      }
      values += `(${productId}, '${url}')`;
    });
    console.log(values);
    db.query(`INSERT INTO product_images (productId, url) VALUES ${values}`, (err, rows, fields) => {
      if(err) {
        return failure(err.message);
      }

      if(rows.affectedRows > 0) {
        return success(true)
      }
      else {
        return failure('Database operation failed.');
      }
    });
  }
}

const productModel = new ProductModel();
module.exports = productModel;
