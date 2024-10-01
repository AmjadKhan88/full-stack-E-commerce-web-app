<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\SubCategoy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubCategoyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $keywords = $request->input('keywords', '');

        $query = SubCategoy::with('category');

        // Apply search filter if keywords are present
        if (!empty($keywords)) {
            $query->where('name', 'like', "%{$keywords}%");
        }

        // Paginate the results
        $subCategory = $query->paginate(6);

        // Return response
        return response()->json([
            'status' => true,
            'message' => 'All Subcategories fetched successfully',
            'subcategory' => $subCategory,
        ], 200);
    }


    /**
     * get all active sub categories
     */
    public function getActiveSubCategory(Request $request)
    {
        $subCategory =SubCategoy::where('status','=', 1)->get();
        if($subCategory){
            return response()->json([
                'status' => true,
                'message' => 'All active sub categories fetched successfully',
                'sub_category' => $subCategory
            ],200);
        }else{
            return response()->json([
                'status' => false,
                'message' => 'Not found any active sub categories',
            ],404);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $validater = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'slug' => 'required|unique:sub_categoys,slug',
                'status' => 'required',
                'category_id' => 'required',
            ]
        );

        if ($validater->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'All fields are required',
                'errors' => $validater->errors()->all(),
            ], 400);
        }

        $category = SubCategoy::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'status' => $request->status,
            'category_id' => $request->category_id,
            'user_id' => $user->id,
        ]);

        if ($category) {
            return response()->json([
                'status' => true,
                'message' => 'SubCategory created successfully',
                'sub_category' => $category
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'SubCategory not created successfully',
            ]);
        }
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
    public function edit(Request $request, string $id)
    {
        $user = $request->user();
        $subCategory = SubCategoy::with('category')->find($id);

        if (!$subCategory) {
            return response()->json([
                'status' => false,
                'message' => 'The requested sub_category does not exist'
            ], 404);
        }

        if ($user->role != 1 || $user->id != $subCategory->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Unothorized sub_category requsted'
            ], 405);
        }

        return response()->json([
            'status' => true,
            'message' => 'Sub category fetched successfully',
            'sub_category' => $subCategory
        ], 200);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();
        $validater = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'slug' => 'required|unique:sub_categoys,slug,' . $id,
                'status' => 'required',
                'category_id' => 'required',
            ]
        );

        if ($validater->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'All fields are required',
                'errors' => $validater->errors()->all(),
            ], 400);
        }

        $subCategory = SubCategoy::find($id);

        if (!$subCategory) {
            return response()->json([
                'status' => false,
                'message' => 'No Subcategory found',
            ], 404);
        }

        if ($user->role != 1 || $user->id != $subCategory->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid Unothorized request',
            ], 404);
        }

        $category = SubCategoy::where('id', '=', $id)->update([
            'name' => $request->name,
            'slug' => $request->slug,
            'status' => $request->status,
            'category_id' => $request->category_id,
            'user_id' => $user->id,
        ]);

        if ($category) {
            return response()->json([
                'status' => true,
                'message' => 'SubCategory update successfully',
                'sub_category' => $category
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'SubCategory not update successfully',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $user = $request->user();
        $subCategory = SubCategoy::find($id);

        if (!$subCategory) {
            return response()->json([
                'status' => false,
                'message' => 'The requested subcategory does not exist',
            ], 405);
        }

        if ($user->role != 1 || $user->id != $subCategory->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid Unothorized request for subCategory deletion',
            ], 404);
        }

        if ($subCategory->delete()) {
            return response()->json([
                'status' => true,
                'message' => 'SubCategory deleted successfully',
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'SubCategory not deleted',
            ], 500);
        }

    }
}
