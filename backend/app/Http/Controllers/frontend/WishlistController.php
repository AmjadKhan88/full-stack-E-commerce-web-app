<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if($user){
            $wishlist =Wishlist::with('products')->where('user_id',$user->id)->paginate();
            return response()->json([
                'status' => true,
                'message' => 'All wishlist fetched successfully',
                'wishlist' => $wishlist
            ],200);
        }else{
            return response()->json([
                'status' => false,
                'message' => 'Unothorized request please sign in',
            ],404);
        }
    }

    public function checkWishlist($productId, Request $request)
    {
        $userId = $request->user()->id;

        // Check if the product is already in the wishlist
        $exists = Wishlist::where('user_id', $userId)
                          ->where('product_id', $productId)
                          ->exists();

        return response()->json(['inWishlist' => $exists]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function addToWishlist($productId, Request $request)
    {
        $userId = $request->user()->id;

        // Add to wishlist if not already there
        Wishlist::firstOrCreate([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);

        return response()->json(['message' => 'Added to wishlist']);
    }

    public function removeFromWishlist($productId, Request $request)
    {
        $userId = $request->user()->id;

        // Remove from wishlist
        Wishlist::where('user_id', $userId)
                ->where('product_id', $productId)
                ->delete();

        return response()->json(['message' => 'Removed from wishlist']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

}
