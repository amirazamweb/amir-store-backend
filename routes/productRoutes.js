const express = require('express');
const router = express.Router();
const {uploadProductController, updateProductController, deleteProductController, totalProductCountController, productPaginationHandler, productCountByCategoryController, categoryListcontroller, productCategoryHandler, singleProductHandler, recommendProductController, searchProductController, orderProductController, allOrdersController, allOrdersByPaginationController, updateOrderStatusController, userOrderController} = require('../controller/productController')

// upload product || POST
router.post('/upload', uploadProductController);

// update single product
router.post('/update/:id', updateProductController);

// delete single product
router.delete('/delete/:id', deleteProductController)

// get total product count
router.get('/total-product-count', totalProductCountController);

// product pagination
router.post('/pagination', productPaginationHandler);

// product count by category
router.post('/product-count/:category', productCountByCategoryController);

// get single poroduct each category
router.get('/category-list', categoryListcontroller);

// get all product by category
router.get('/product-category/:category', productCategoryHandler);

// get single product
router.get('/single-product/:id', singleProductHandler)

// recommended product
router.post('/recommend-product/:id', recommendProductController)

// search product
router.post('/search', searchProductController);

//upload order product
router.post('/order', orderProductController);

// get all orders
router.get('/all-orders', allOrdersController);

// all orders by pagination
router.post('/all-orders/:page', allOrdersByPaginationController);

// change order status
router.post('/update-order-status/:id', updateOrderStatusController);

// get user orders
router.get('/user-order/:id', userOrderController)



module.exports = router;