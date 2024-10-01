<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategoy;
use Illuminate\Http\Request;

class FrontendProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $LatestProduct = Product::where('is_featured', 'No')->where('status', 1)->latest()->paginate();

        return response()->json([
            'status' => true,
            'message' => 'Latest Products fetched successfully',
            'latestProduct' => $LatestProduct
        ], 200);
    }

    // / ** 
    // * Show all the products on shop page 

    public function shopProduct(Request $request)
    {
        $shopProduct = Product::where('status', 1);

        // Category filter
        if (!empty($request->input('category'))) {
            $category = Category::where('slug', $request->input('category'))->first();
            if ($category) {
                $shopProduct = $shopProduct->where('category_id', $category->id);
            }
        }

        // Sub-category filter
        if (!empty($request->input('sub_category'))) {
            $sub_category = SubCategoy::where('slug', $request->input('sub_category'))->first();
            if ($sub_category) {
                $shopProduct = $shopProduct->where('sub_category_id', $sub_category->id);
            }
        }

        // Brand filter
        if (!empty($request->input('brands'))) {
            $brand = Brand::where('slug', $request->input('brands'))->first();
            if ($brand) {
                $shopProduct = $shopProduct->where('brand_id', $brand->id);
            }
        }

        // search filters
        if(!empty($request->input('search'))){
            $shopProduct = $shopProduct->where('title','like','%'.$request->input('search').'%');
        }
      

        // Price filter
        if (!empty($request->input('min_price')) && !empty($request->input('max_price'))) {
            $minPrice = (float) $request->input('min_price');
            $maxPrice = (float) $request->input('max_price');

            // Ensure minPrice is less than maxPrice
            if ($minPrice <= $maxPrice) {
                if($maxPrice >= 1000){
                    $shopProduct =$shopProduct->whereBetween('price',[$minPrice,1000000]);
                }else{
                $shopProduct = $shopProduct->whereBetween('price', [$minPrice, $maxPrice]);
                }
            } else {
                // Handle the case where minPrice is greater than maxPrice
                return response()->json([
                    'status' => false,
                    'message' => 'Invalid price range',
                ], 400);
            }
        }

        // Sorting
        if ($request->has('sort')) {
            $sort = $request->input('sort');
            switch ($sort) {
                case 'price_high':
                    $shopProduct = $shopProduct->orderBy('price', 'desc');
                    break;
                case 'price_low':
                    $shopProduct = $shopProduct->orderBy('price', 'asc');
                    break;
                case 'latest':
                    $shopProduct = $shopProduct->orderBy('created_at', 'desc');
                    break;
                default:
                    $shopProduct = $shopProduct->orderBy('created_at', 'desc');
                    break;
            }
        }

        // Paginate the results
        $shopProduct = $shopProduct->paginate(8);

        return response()->json([
            'status' => true,
            'message' => 'Latest Products fetched successfully',
            'shopProduct' => $shopProduct,
            'query' => [
                'category' => $request->input('category'),
                'subcategory' => $request->input('sub_category'),
                'brand' => $request->input('brands'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'search' => $request->input('search'),
            ],
        ], 200);
    }





    /**
     * Show featured products for home
     */
    public function featureProduct(Request $request)
    {
        $featureProduct = Product::where('is_featured', 'Yes')->where('status', 1)->latest()->get();

        return response()->json([
            'status' => true,
            'message' => 'Featured Products fetched successfully',
            'featureProduct' => $featureProduct
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, string $slug)
    {
         $product = Product::with(['category','sub_category','brands'])->where('slug',$slug)->first();
        $related_products =[];
         if($product){
            if(!empty($product->related_products)){
                $related_products = Product::whereIn('id',$product->related_products)->get();
            }

            return response()->json([
                'status' => true,
                'message' => 'Single Product fetched successfully',
                'product' => $product,
                'related_products' => $related_products
            ],200);
         }else{
            return response()->json([
                'status' => false,
                'message' => 'The Requested Product could not be found',
            ],404);
         }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
