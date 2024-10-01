<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Retrieve keywords from the request, defaulting to an empty string
        $keywords = $request->input('keywords', '');
    
        // Query the Category model with a search filter and pagination
        $category = Category::where('name', 'like', "%{$keywords}%")->paginate(8); // Specify the number of items per page, e.g., 10
    
        // Return the JSON response with status, message, and category data
        return response()->json([
            'status' => true,
            'message' => 'Category fetched successfully',
            'category' => $category,
        ], 200);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
    
        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'slug' => 'required|unique:categories,slug',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'All fields are required',
                'errors' => $validator->errors()->all(),
            ], 400);
        }
    
        // Image handling
        $imageName = '';
        if ($request->hasFile('image')) {
            $img = $request->file('image');
            $imageName = time() .'-category'. '.' . $img->getClientOriginalExtension();
            
        }
    
        // Create category
        $category = Category::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'status' => $request->status,
            'user_id' => $user->id,
            'show_on_top' => $request->show_on_top,
            'image' => $imageName
        ]);
    
        if ($category) {
            if($request->hasFile('image')) {
            $img->move(public_path('uploads/category'), $imageName);
            }
            return response()->json([
                'status' => true,
                'message' => 'Successfully created category',
                'category' => $category
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Category not inserted',
            ], 500);
        }
    }
    // get active categories

    public function getActiveCategories(Request $request){
        $user = $request->user();
        $category =Category::where('status','=', 1)->get();

        if(!$category){
            return response()->json([
                'status' => false,
                'message' => 'Category not found',
            ],404);
        }else{
            return response()->json([
                'status' => true,
                'message' => 'Active categories fetched successfully',
                'category' => $category
            ],200);
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
        $category =Category::find($id);

        if($user->role != 1 || $user->id != $category->user_id){
            return response()->json([
                'status' => false,
                'message' => 'Unothorized request failed to find category',
            ],404);
        }
        if(!empty($category)){
            return response()->json([
                'status' => true,
                'message' => 'Category found successfully',
                'category' => $category
            ],200);
        }else{
            return response()->json([
                'status' => false,
                'message' => 'Category not found',
            ],400);
        }

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'slug' => 'required|unique:categories,slug,' . $id,
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => true,
                'message' => 'All fields are required',
                'errors' => $validator->errors()->all(),
            ], 400);
        }

        $oldCateory =Category::find($id);

        if(!$oldCateory){
            return response()->json([
                'status' => false,
                'message' => 'The Requested Category does not exist',
            ],400);
        }

        if($user->role != 1 || $user->id != $oldCateory->user_id){
            return response()->json([
                'status' => false,
                'message' => 'UnAuthorized Request for Category'
            ],404);
        }

        $imageName = $oldCateory->image;

        if ($request->hasFile('image')) {
            $filePath = public_path('uploads/category/' . $imageName);
            if (File::exists($filePath)) {
                File::delete($filePath);
            }
    
            $img = $request->file('image');
            $ext = $img->getClientOriginalExtension();
            $imageName = time() .'-category'. '.' . $ext;
            
        }


        $category = Category::where('id','=',$id)->update([
            'name' => $request->name,
            'slug' => $request->slug,
            'status' => $request->status,
            'show_on_top' => $request->show_on_top,
            'image' => $imageName
        ]);

        if($category){
            if($request->hasFile('image')){
            $img->move(public_path() . '/uploads/category', $imageName);
            }
            return response()->json([
                'status' => true,
                'message' => 'Successfully Update category',
                'category' => $category
            ],200);
        }else{
            return response()->json([
                'status' => false,
                'message' => 'Category not updated',
            ],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request,string $id)
    {
        $user = $request->user();
        $category =Category::find($id);

        if($user->role != 1 || $user->id != $category->user_id){
            return response()->json([
                'status' => false,
                'message' => 'Unothorized request Category not deleted',
            ],404);
        }

        if(!empty($category)){
            $filePath = public_path('uploads/category/' . $category->image);
            if (File::exists($filePath)) {
                File::delete($filePath);
            }
            if($category->delete()){
                return response()->json([
                    'status' => true,
                    'message' => 'Category deleted successfully',
                ],200);
            }else{
                return response()->json([
                    'status' => false,
                    'message' => 'Category not deleted successfully',
                ],500);
            }
          
        }else{
            return response()->json([
                'status' => false,
                'message' => 'Category not found',
            ],400);
        }
    }
}
