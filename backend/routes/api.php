<?php

use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\CountryController;
use App\Http\Controllers\admin\DiscountController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\ShippingController;
use App\Http\Controllers\admin\SubCategoyController;
use App\Http\Controllers\frontend\CustomerController;
use App\Http\Controllers\frontend\FrontendBrandController;
use App\Http\Controllers\frontend\FrontendCategoryController;
use App\Http\Controllers\frontend\FrontendProductController;
use App\Http\Controllers\frontend\OrderController;
use App\Http\Controllers\frontend\WishlistController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;




// public routes 
    // user routes
Route::controller(UserController::class)->group(function () {
    Route::post("/user/signup","store");
    Route::post("/user/login","login");
});


// protected Routes 

Route::group(["middleware" => ["auth:sanctum"]],function (){
    // user protected routes
        Route::controller(UserController::class)->group(function (){
                // user logout route
                Route::post("/user/logout", "logout");
                // user delete route
                Route::post("/user/delete/{id}", "destroy");
                // fetch all users
                Route::get("/user", "index");
                // fetch single user record
                Route::get("/user/{id}", "show");
                // update user record 
                Route::post("/user/update/{id}", "update");
                Route::get("/user/userFetch/{token}", "userFetch");
        });

        // Category protected routes 
        Route::controller(CategoryController::class)->group(function (){
                // all categories fetched
                Route::get("/category",'index');
                // single category fetched with id
                Route::get("/category/single/{id}",'edit');
                // Insert a new category
                Route::post("/category/store", 'store');
                // update category
                Route::post("/category/update/{id}", 'update');
                // delete category
                Route::delete("/category/delete/{id}", 'destroy');
                // get all active categories
                Route::get("/category/active",'getActiveCategories');
        });

        // SubCategory protected routes
        Route::controller(SubCategoyController::class)->group(function (){
                // get all categories
                Route::get("/subcategory",'index');
                // get single category
                Route::get("/subcategory/single/{id}", 'edit');
                // insert new sub category
                Route::post("/subcategory/create", 'store');
                // update sub category
                Route::post("/subcategory/update/{id}", 'update');
                // delete sub category
                Route::delete("/subcategory/delete/{id}", 'destroy');
                // get all active categories
                Route::get("/subcategory/active","getActiveSubCategory");
        });

        // Brands protected routes
        Route::controller(BrandController::class)->group(function (){
                // get all brand
                Route::get("/brands",'index');
                // get all active brand
                Route::get("brands/active",'getActiveBrands');
                // get single brand
                Route::get("/brands/single/{id}",'edit');
                // insert new brand
                Route::post("/brands/create","store");
                // update single brand
                Route::post("/brands/update/{id}","update");
                // delete single brand
                Route::delete("/brands/delete/{id}","destroy");
        });

        // Products protected routes
        Route::controller(ProductController::class)->group(function (){
                // get all products
                Route::get("/products","index");
                // get single product
                Route::get("/products/single/{id}","edit");
                // store product route
                Route::post("/products/create","store");
                // update product route
                Route::post("/products/update/{id}","update");
                // delete product route
                Route::delete("/products/delete/{id}","destroy");
                // delete specific image from images json coloumn
                Route::delete("/products/deleteImage/{id}","deleteImage");
                // get related product route 
                Route::get("/products/getRelatedProduct","getRelatedProduct");
                // get related product to show in update product route
                Route::get("/products/getRelatedProductsToShow","getRelatedProductsToShow");
                // delete related product from json coloumn
                Route::delete("/products/deleteOldRelatedProducts/{id}","deleteOldRelatedProducts");
        });

        // Wishlist protected routes
        Route::controller(WishlistController::class)->group(function (){
                // fetch all wishlist
                Route::get('/wishlist','index');
                // store wishlist
                Route::post('/wishlist/add/{productId}','addToWishlist');
                // delete wishlist
                Route::delete('/wishlist/remove/{productId}','removeFromWishlist');
                 // routes/api.php
                Route::get('/wishlist/check/{productId}','checkWishlist');
        });

        // Shipping Routes
        Route::controller(ShippingController::class)->group(function (){
                // Get shipping rates
                Route::get('/shipping','index');
                // STORE shipping rate
                Route::post('/shipping/store', 'store');
                // Get Singleton shipping rates
                Route::get('/shipping/single/{id}','edit');
                // Update shipping rates
                Route::post('/shipping/update/{id}', 'update');
                // delete shipping rates
                Route::delete('/shipping/delete/{id}', 'destroy');
        });

        // Customer orders Routes
        Route::controller(OrderController::class)->group(function (){
                // Get all customer orders
                Route::get('/orders','index');
                // Get Single customer orders
                Route::get('/orders/single/{id}','edit');
                // Store customer orders
                Route::post('/orders/create','store');
                // update customer orders
                Route::post('/orders/update/{id}','update');
                // delete customer orders
                Route::delete('/orders/delete/{id}','destroy');
                // Get all shipping charges
                Route::get('/shipping/get/{id}','getShippingChares');
        });

        // Customer Controller to get customer address and more routes
        Route::controller(CustomerController::class)->group(function (){
                // get single customer address
                Route::get('/getuseraddress','getAddress');
        });

        // Discount Controller to manage discount
        Route::controller(DiscountController::class)->group(function () {
                // get all discounts coupon codes
                Route::get('/discount','index');
                // get single discount coupon code
                Route::get('/discount/single/{id}','edit');
                // store discount coupon code
                Route::post('/discount/create','store');
                // update discount coupon code
                Route::post('/discount/update/{id}','update');
                // delete discount coupon code
                Route::delete('/discount/delete/{id}','destroy');
        });
        
});


        // **************************************************************** //
                                // *** unProtected Routes *** //
        // frontend product controller
Route::controller(FrontendProductController::class)->group( function (){
        // get all latest products
        Route::get("/products/latestproducts","index");
        // get all featured products
        Route::get("/products/featuredproducts",'featureProduct');
        // get all products for shop page 
        Route::get("/shop/products",'shopProduct');
        // get Single Product for frontend
        Route::get("/products/singleProduct/{slug}",'edit');
});

        // frontend Category controller
Route::controller(FrontendCategoryController::class)->group(function (){
        // get all active categories
        Route::get("/category/frontend/active",'index');
        // get all active & show_on_to categories
        Route::get("/category/frontend/show_on_top",'topNavCategory');
});
        // frontend brands controller
Route::controller(FrontendBrandController::class)->group(function (){
        // get all active brands
        Route::get("/brands/getActiveBrands",'getActiveBrands');
});

        // frontend Countries controller 
Route::controller(CountryController::class)->group(function (){
        // get all active countries
        Route::get("/country",'index');
});