const ProductModel = require('../models/productModel');
const OrderModel = require('../models/orderModel');
const UserModel = require('../models/userModel');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const orderMail = require('../helpers/orderMail');
const updateOrderStatusEmail = require('../helpers/updateOrderStatusEmail');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, 
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD
  },
});

// upload product
const uploadProductController = async(req, res)=>{
    try {
        const uploadProduct = new ProductModel(req.body);
        uploadProduct.save();

        res.send({
            success:true,
            message:'Product upload successfully',
            data:uploadProduct
        })
        
    } catch (error) {
        console.log(error);
        res.send({
            success:false,
            message:'Error whileuploading product'
        })
    }
}


// updateProductController
const updateProductController = async(req, res)=>{
       try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.send({
            success:true,
            message:'Product updated successfully!',
            updatedProduct
        })
       } catch (error) {
        res.send({
            success:false,
            message:'Error while updating the product'
        })
        console.log(error);
       }
}

// deleteProductController
const deleteProductController = async(req, res)=>{
      try {
        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
        res.send({
            success:true,
            message:'Product deleted successfully!'
        })
      } catch (error) {
        res.send({
            success:false,
            message:'Error while deleteing the product'
        })
        console.log(error);
      }
}

// totalProductCountController
const totalProductCountController = async(req, res)=>{
    try {
        const toatalProductCount = await ProductModel.find({}).estimatedDocumentCount();
        res.send({
            success:true,
            toatalProductCount
        });
    } catch (error) {
        res.send({
            success:false,
            message:'Error while getting product count'
        })
        console.log(error);
    }
}

// pagination
const productPaginationHandler = async(req, res)=>{
    const {paginationCategory, paginationPageNumber} = req.body;
    const numberOfSkipProduct = (paginationPageNumber-1)*12;
    let productCategory = {category:''}
    if(paginationCategory==='all'){
        productCategory = {}
    }

    else{
     productCategory = {category:paginationCategory}
    }

    const paginatedProductList = await ProductModel.find(productCategory).skip(numberOfSkipProduct).limit(12).sort({createdAt:-1});

    res.send({
        success:true,
        message:'Product list by page number',
        paginatedProductList
    })
    
    try {
        
    } catch (error) {
        res.send({
            success:false,
            message:'Error while paginating product'
        })
        console.log(error);
    }
}

// productCountByCategoryController
const productCountByCategoryController = async(req,res)=>{
    try {
        let productCategory = {category:''}
    if(req.params.category==='all'){
        productCategory = {}
    }
    else{
     productCategory = {category:req.params.category}
    }
    const toatalProduct = await ProductModel.find(productCategory);
    res.send({
        success:true,
        toatalProduct:toatalProduct.length
    });
    } catch (error) {
        
    }
}


// single product from each category
const categoryListcontroller = async(req, res)=>{
    try {
     const categories = await ProductModel.distinct('category');
      const products = [];

      for(const category of categories){
         const singleProduct = await ProductModel.findOne({category});
         products.push(singleProduct);
      }

      res.send({
        success:true,
        message: 'Single product from each category',
        products
      })
      
    } catch (error) {
        res.send({
            success:false,
            message:'Error while getting singlr product from each category'
        })
        console.log(error);
    }
}

// productCategoryHandler
const productCategoryHandler = async(req, res)=>{
    try {
       const {category} = req.params;
        const products = await ProductModel.find({category});
        res.send({
            success:true,
            products
        })
    } catch (error) {
        res.send({
            success:false,
            message:'Error while getting product category'
        })
        console.log(error);
    }
}

// singleProductHandler
const singleProductHandler = async(req, res)=>{
    try {
        const productDetails = await ProductModel.findById(req.params.id);
        res.send({
            success:true,
            message: 'Single product details',
            productDetails
        })
    } catch (error) {
        res.send({
            success:false,
            message:'Error while getting single product'
        })
        console.log(error);
    }
}

// recommendProductController
const recommendProductController = async(req, res)=>{
       try {
        const {id} = req.params;
        let products;
        if(id!='dummy'){
            products = await ProductModel.find({category: req.body.category,_id:{$nin:[req.params.id]}}).sort({createdAt:-1});
        }

        else{
            products = await ProductModel.find({category: {$in:[...req.body.category]}}).sort({createdAt:-1});
        }
        res.send({
            success:true,
            message:'All recommended products',
            products
        })
       } catch (error) {
        res.send({
            success:false,
            message:'Error while getting single product'
        })
        console.log(error);
       }
}


// search product
const searchProductController = async(req, res)=>{
    try {
        const { keyword } = req.body;

        const results = await ProductModel.find({
            $or: [{ productName: { $regex: keyword, $options: 'i' } },
            { brandName: { $regex: keyword, $options: 'i' } }]
        })

        res.send({
            success:true,
            message: 'Sewarch product list',
            results
        })
        
    } catch (error) {
        res.send({
            success:false,
            message:'Error searching product'
        })
        console.log(error);
    }
}


// order product
const orderProductController = async(req, res)=>{
    try {
        
        const uploadOrderProduct = new OrderModel(req.body);
        uploadOrderProduct.save();

        const orderNumber = uploadOrderProduct._id.valueOf();

        const user = await UserModel.findById(uploadOrderProduct.buyer).select({name:1, email:1});

        const buyer = user.name;

        const email = user.email;


        //  send order mail
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: `Order Confirmation - ${orderNumber}`,
            html: orderMail(buyer, orderNumber)
          }
          
           const info = await transporter.sendMail(mailOptions);

        res.send({
            success:true,
            message : 'Order placed successfully'
        });
        
    } catch (error) {
        res.send({
            success:false,
            message:'Error while ordering product'
        })
        console.log(error);
    }
}

// allOrdersController
const allOrdersController = async(req, res)=>{
    try {
        const allOrders = await OrderModel.find({}).populate('buyer');
        res.send({
            success:true,
            message: 'All orders',
            allOrders
        })
    } catch (error) {
        res.send({
            success:false,
            message:'Error while getting all orders'
        })
        console.log(error);
    }
}

// allOrdersByPaginationController
const allOrdersByPaginationController = async(req, res)=>{
    try {
      const {page} = req.params;
      const numberOfSkipUsers = (page-1)*19;
  
      const orders = await OrderModel.find({}).populate('buyer').sort({createdAt:-1}).skip(numberOfSkipUsers).limit(19);
      
      res.send({
        success:true,
        message:'All orders by pagination number',
        orders
      })
      
    } catch (error) {
      res.send({
        success:false,
        message: 'Error while getting all orders by pagination!'
      })
      console.log(error);
    }
  }


//   updateOrderStatusController
const updateOrderStatusController = async(req, res)=>{
    try {
        const {orderStatus} = req.body
        const updatedOrderStatus = await OrderModel.findByIdAndUpdate(req.params.id, {status: orderStatus}, {new:true});
    //    start
        const orderNumber = updatedOrderStatus._id.valueOf();
        const orderDate =  updatedOrderStatus.createdAt;
        const status = updatedOrderStatus.status;
        const user = await UserModel.findById(updatedOrderStatus.buyer).select({name:1, email:1});

        const buyer = user.name;

        const email = user.email;

         const cancelledSubject = `Order Cancellation Notification - ${orderNumber}`;
         const updatedStatusSubject = `Update on Order Status - ${orderNumber}`
        //  send order mail
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: `${status==='Cancelled'?cancelledSubject:updatedStatusSubject }`,
            html: updateOrderStatusEmail(buyer, orderNumber, orderDate, status)
          }
          
           const info = await transporter.sendMail(mailOptions);


        //    end

        res.send({
          success:true,
          message: 'Order status updated successfully!'
        })
      } catch (error) {
        res.send({
          success:false,
          message: 'Something went wrong!'
        })
        console.log(error);
      }
}

// user order
const userOrderController = async(req, res)=>{
    try {
      const {id} = req.params; 
      const orders = await OrderModel.find({buyer:id}).sort({createdAt:-1});
      res.send({
        success:true,
        message:'user orders',
        orders
      }) 
    } catch (error) {
        res.send({
            success:false,
            message: 'Error while getting user order'
          })
          console.log(error);
    }
}

module.exports = {uploadProductController, updateProductController, deleteProductController, totalProductCountController, productPaginationHandler, productCountByCategoryController, categoryListcontroller, productCategoryHandler, singleProductHandler, recommendProductController, searchProductController, orderProductController, allOrdersController, allOrdersByPaginationController, updateOrderStatusController, userOrderController}
