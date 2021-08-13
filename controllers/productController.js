let productModel = require('../models/productModel');
let Helper = require('../helpers/general');

class ProductController {
  getProducts(req, res, next) {
    productModel.getProducts(
      products => res.json(products),
      error => res.status(500).json({messaage: 'Internal Server Error - '+error})
    );
  }

  addProduct(req, res, next) {
    if (!Helper.verifyRequiredParams(req.body, res, ['name', 'description', 'barcodeNumber', 'urls'])) {
      return;
    }
    productModel.addProduct(req.body,
      result => productModel.addImages(result.id, req.body.urls,
        resp => res.status(201).json(result),
        err => res.status(500).json({message: 'Internal Server Error - '+err})
      ),
      error => res.status(500).json({message: 'Internal Server Error - '+error})
    );
  }

  putProductById(req, res, next) {
    if (!Helper.verifyRequiredParams(req.body, res, ['name', 'description', 'barcodeNumber'])) {
      return;
    }
    productModel.putProduct(req.params.productId, req.body,
      result => res.json(result),
      notFound => res.status(400).json({message: 'No product found of the given id.'}),
      error => res.status(500).json({message: 'Internal Server Error - '+error})
    );
  }

  deleteProductById(req, res, next) {
    productModel.deleteProduct(req.params.productId,
      result => res.json({message: 'Successfully Deleted!'}),
      error => res.status(500).json({message: 'Internal Server Error - '+error})
    );
  }
}

const productController = new ProductController();
module.exports = productController;
