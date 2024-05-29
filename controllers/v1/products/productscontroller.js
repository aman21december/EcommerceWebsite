const { ErrorHandler } = require("../../../helper/error-handler.js");
const Product=require("../../../models/product.js");
const { ApiFIlter } = require("../../../utils/apiFilters.js");
const getProducts=async(req,res)=>{
    const resPerPage=4
    const apiFIlter =new ApiFIlter(Product,req.query).search().filters()
    
    let products =await apiFIlter.query;
    let filteredProductCount=products.length

    apiFIlter.pagination(resPerPage);
    products = await apiFIlter.query.clone();
    res.status(200).json({
        resPerPage,
        filteredProductCount,
        products
    })
}

const newProducts=async(req,res)=>{
    req.body.user = req.user._id;
    const product = await Product.create(req.body);
    res.status(200).json({product});
}
const getProductDetails=async(req,res,next)=>{
    const product =await Product.findById(req?.params?.id);
    if(!product){
        return next(new ErrorHandler(404,"product not found"))
    }
    res.status(200).json({product})
}

const updateProduct=async(req,res)=>{
    let product =await Product.findById(req?.params?.id);
    
    if(!product){
        return res.status(404).json({
            error:"product not found"
        }
        )
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
        new: true,
      });
    
      res.status(200).json({
        product,
      });
}
const deleteProduct=async(req,res)=>{
    let product =await Product.findById(req?.params?.id);
    
    if(!product){
        return res.status(404).json({
            error:"product not found"
        }
        )
    }

    await product.deleteOne();
    
      res.status(200).json({
        "message":true
      });
}
// Create/Update product review   =>  /api/v1/reviews
 const createProductReview =async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req?.user?._id,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    if (!product) {
      return next(new ErrorHandler(404,"Product not found"));
    }
  
    const isReviewed = product?.reviews?.find(
      (r) => r.user.toString() === req?.user?._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review?.user?.toString() === req?.user?._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  }

  // Get product reviews   =>  /api/v1/reviews
 const getProductReviews = async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHandler(404,"Product not found"));
    }
  
    res.status(200).json({
      reviews: product.reviews,
    });
  }

  const deleteReview = async (req, res, next) => {
    let product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler(404,"Product not found"));
    }
  
    const reviews = product?.reviews?.filter(
      (review) => review._id.toString() !== req?.query?.id.toString()
    );
  
    const numOfReviews = reviews.length;
  
    const ratings =
      numOfReviews === 0
        ? 0
        : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          numOfReviews;
  
    product = await Product.findByIdAndUpdate(
      req.query.productId,
      { reviews, numOfReviews, ratings },
      { new: true }
    );
  
    res.status(200).json({
      success: true,
      product,
    });
  }
module.exports={getProducts,newProducts,getProductDetails,updateProduct,deleteProduct,createProductReview,getProductReviews,deleteReview}