<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $keywords = $request->input('keywords', '');

        $products = Product::with('category', 'user', 'sub_category')
            ->where('title', 'like', "%{$keywords}%")
            ->paginate(8);

        return response()->json([
            'status' => true,
            'message' => 'All products fetched successfully',
            'products' => $products
        ], 200);
    }

    /**
     * get related products api 
     */
    public function getRelatedProduct(Request $request)
    {
            $tempProduct = [];
            if($request->term != ""){
                $product = Product::where('title','like','%'. $request->term.'%')->get(['id','title']);
                if($product != null){
                    foreach($product as $value){
                        $tempProduct[] = array('id' => $value->id, 'text' => $value->title);
                    }
                }
            }

            return response()->json([
                'tags' => $tempProduct,
                'status' => true,
            ],200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {



        $validater = Validator::make(
            $request->all(),
            [
                'title' => 'required',
                'slug' => 'required|unique:products,slug',
                'featured_image' => 'required|image',
                'category_id' => 'required',
                'sku' => 'required',
                'price' => 'required',
            ]
        );

        if ($validater->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'All fields are required',
                'errors' => $validater->errors()->all(),
            ], 400);
        }

        $user = $request->user();
        $featured_image = '';
        $imagePaths = [];

        if ($request->hasFile('images')) {
            $uploadedFiles = $request->file('images');

            foreach ($uploadedFiles as $file) {
                $filename = Str::uuid() . '-products.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/products'), $filename); // use relative path
                $imagePaths[] = $filename;
            }
        }

        if ($request->hasFile('featured_image')) {
            $img = $request->file('featured_image');
            $ext = $img->getClientOriginalExtension();
            $featured_image = time() . '-product.' . $ext;
            $img->move('uploads/products', $featured_image); // use relative path
        }

        $store = [
            'title' => $request->title,
            'slug' => $request->slug,
            'featured_image' => $featured_image,
            'category_id' => $request->category_id,
            'sku' => $request->sku,
            'price' => $request->price,
            'description' => $request->description ?? null,
            'short_description' => $request->short_description ?? null,
            'shipping_returns' => $request->shipping_returns ?? null,
            'images' => $imagePaths, // store the array directly
            'status' => $request->status ?? 1,
            'compare_price' => $request->compare_price ?? null,
            'is_featured' => $request->is_featured ?? 'No',
            'track_qty' => $request->track_qty ?? 'Yes',
            'qty' => $request->qty ?? null,
            'related_products' => $request->related_products, // Store related products as JSON
            'barcode' => $request->barcode ?? null,
            'user_id' => $user ? $user->id : null,
            'sub_category_id' => $request->sub_category_id ?? null,
            'brand_id' => $request->brand_id ?? null,
        ];

        $products = Product::create($store);

        if ($products) {
            return response()->json([
                'status' => true,
                'message' => 'Product created successfully',
                'products' => $products
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Product not created successfully',
            ], 500);
        }
    }


    // delete related products matching vith id 

    public function deleteOldRelatedProducts(Request $request, string $id) {
        $user = $request->user();
        $products = Product::find($id);
        if (!$products) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found',
            ], 404);
        }
        if ($user->role != 1 || $user->id != $products->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Unothorized request for product image deletion',
            ], 405);
        }
        $relatedToDelete = $request->product_id;
        if ($products) {
            // Decode the JSON column to a PHP array  
            $related_products = $products->related_products;

            // Check if images is an array  
            if (is_array($related_products)) {

                // Remove the image from the array  
                $updateRelated = array_diff($related_products, [$relatedToDelete]);

                // Update the images column with the new array  
                $products->related_products = array_values($updateRelated); // Reindex the array  
                $result = $products->save(); // Save changes 
                if ($result) {
                    return response()->json([
                        'status' => true,
                        'message' => 'Related product deleted successfully',
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Related product not deleted',
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Something went wrong to delete the related product or not in array'
                ], 500);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function deleteImage(Request $request, string $id)
    {
        $user = $request->user();
        $products = Product::find($id);
        if (!$products) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found',
            ], 404);
        }
        if ($user->role != 1 || $user->id != $products->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Unothorized request for product image deletion',
            ], 405);
        }
        $imageToDelete = $request->image;
        if ($products) {
            // Decode the JSON column to a PHP array  
            $images = $products->images;

            // Check if images is an array  
            if (is_array($images)) {

                // Remove the image from the array  
                $images = array_diff($images, [$imageToDelete]);

                // Update the images column with the new array  
                $products->images = array_values($images); // Reindex the array  
                $result = $products->save(); // Save changes 
                if ($result) {
                    $path = public_path('uploads/products/' . $request->image);
                    if (File::exists($path)) {
                        File::delete($path);
                    }
                    return response()->json([
                        'status' => true,
                        'message' => 'Image deleted successfully',
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Image not deleted',
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Something went wrong the images or not in array'
                ], 500);
            }
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, string $id)
    {
        $user = $request->user();
        $products = Product::with('category', 'sub_category', 'user')->find($id);
        if (!$products) {
            return response()->json([
                'status' => false,
                'message' => 'The requested product was not found',
            ], 404);
        }
        // if ($user->role != 1 || $user->id != $products->user_id) {
        //     return response()->json([
        //         'status' => false,
        //         'message' => 'Unothorized request failed get product',
        //     ], 405);
        // }
        $related_products = [];
        if($products->related_products != '') {
                $relatedId = $products->related_products;
            $related_products = Product::whereIn('id',$relatedId)->get(['id','title']);
        }
        return response()->json([
            'status' => true,
            'message' => 'Product fetch successfully',
            'products' => $products,
            'related_products' => $related_products,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $oldProduct = Product::find($id);
        $user = $request->user();
    
        $validator = Validator::make(
            $request->all(),
            [
                'title' => 'required',
                'slug' => 'required|unique:products,slug,' . $id,
                'featured_image' => 'image',
                'category_id' => 'required',
                'sku' => 'required',
                'price' => 'required',
            ]
        );
    
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'All fields are required',
                'errors' => $validator->errors()->all(),
            ], 400);
        }
    
        if (!$oldProduct) {
            return response()->json([
                'status' => false,
                'message' => 'Not found Product to update',
            ], 404);
        }
    
        // if ($user->role != 1 || $user->id != $oldProduct->user_id) {
        //     return response()->json([
        //         'status' => false,
        //         'message' => 'Unauthorized request for product update',
        //     ], 405);
        // }
    
        $featured_image = $oldProduct->featured_image;
        $images = $oldProduct->images;
    
        if (!is_array($images)) {
            $images = [];
        }
    
        $imagePaths = []; // Initialize the array outside the loop
    
        if ($request->hasFile('images')) {
            $uploadedFiles = $request->file('images');
    
            foreach ($uploadedFiles as $file) {
                $filename = Str::uuid() . '-products.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/products'), $filename); // use relative path
                $imagePaths[] = $filename; // Add the filename to the imagePaths array
            }
    
            // Merge the new image paths with the existing ones
            $images = array_merge($images, $imagePaths);
        }
    
        if ($request->hasFile('featured_image')) {
            $img = $request->file('featured_image');
            $ext = $img->getClientOriginalExtension();
            $featured_image = time() . '-product.' . $ext;
            $img->move('uploads/products', $featured_image); // use relative path
            $path = public_path('uploads/products/' . $oldProduct->featured_image);
            if (File::exists($path)) {
                File::delete($path);
            }
        }
    
        // Handle updating related products
        $relatedProducts = $oldProduct->related_products; // Existing related products
    
        if (!is_array($relatedProducts)) {
            $relatedProducts = [];
        }
    
        $newRelatedProducts = explode(',',$request->related_products);
        if (!is_array($newRelatedProducts)) {
            $newRelatedProducts = [];
        }
    
        // Merge the existing related products with the new ones
        $relatedProducts = array_merge($relatedProducts, $newRelatedProducts);
    
        // Remove duplicate values
        $relatedProducts = array_unique($relatedProducts);
    
        $store = [
            'title' => $request->title ?? $oldProduct->title,
            'slug' => $request->slug ?? $oldProduct->slug,
            'featured_image' => $featured_image ?? $oldProduct->featured_image,
            'category_id' => $request->category_id ?? $oldProduct->category_id,
            'sku' => $request->sku ?? $oldProduct->sku,
            'price' => $request->price ?? $oldProduct->price,
            'description' => $request->description ?? $oldProduct->description,
            'short_description' => $request->short_description ?? $oldProduct->short_description,
            'shipping_returns' => $request->shipping_returns ?? $oldProduct->shipping_returns,
            'images' => $images ?? $oldProduct->images, // store the array directly
            'status' => $request->status ?? $oldProduct->status,
            'compare_price' => $request->compare_price ?? $oldProduct->compare_price,
            'is_featured' => $request->is_featured ?? $oldProduct->is_featured,
            'track_qty' => $request->track_qty ?? $oldProduct->track_qty,
            'qty' => $request->qty ?? $oldProduct->qty,
            'related_products' => $relatedProducts, // Updated related products
            'barcode' => $request->barcode ?? $oldProduct->barcode,
            'user_id' => $user ? $user->id : $oldProduct->user_id,
            'sub_category_id' => $request->sub_category_id ?? $oldProduct->sub_category_id,
            'brand_id' => $request->brand_id ?? $oldProduct->brand_id,
        ];
    
        $products = Product::where('id', '=', $id)->update($store);
    
        if ($products) {
            return response()->json([
                'status' => true,
                'message' => 'Product updated successfully',
                'products' => $products,
                'oldRelatedProducts' => $relatedProducts,
                'newRelatedProducts' => $newRelatedProducts,
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Product not updated',
            ], 500);
        }
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $user = $request->user();
        $products = Product::find($id);


        if (!$products) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        if ($user->role != 1 && $user->id != $products->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized request, failed to delete product',
            ], 403); // Changed to 403 for unauthorized access
        }

        $path = public_path('uploads/products/' . $products->featured_image);
        if (File::exists($path)) {
            File::delete($path);
        }

        if (!empty($products->images)) {
            foreach ($products->images as $image) {
                $ImagesPath = public_path('uploads/products/' . $image);
                if (File::exists($ImagesPath)) {
                    File::delete($ImagesPath);
                }
            }
        }

        $reslut = $products->delete();

        if ($reslut) {
            return response()->json([
                'status' => true,
                'message' => 'Product deleted successfully',
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Product not deleted',
            ], 500);
        }
    }

}
