<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $keywords = $request->input('keywords','');
        
        $brands =Brand::where('name','like',"%{$keywords}%")->paginate();

        return response()->json([
            'status' => true,
            'message' => 'All Brands Fetched successfully',
            'brands' => $brands
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function getActiveBrands(Request $request)
    {
        $brands =Brand::where('status','=', 1)->get();
        
        if($brands){
            return response()->json([
                'status' => true,
                'message' => 'Active brands fetched successfully',
                'brands' => $brands
            ],200);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validater =Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'slug' => 'required|unique:brands,slug',
            ]
            );
        if($validater->fails()){
            return response()->json([
                'status' => false,
                'message' => 'All fields are required',
                'errors' =>$validater->errors()->all(),
            ],400);
        }

        $brands =Brand::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'status' => $request->status,
            'user_id' => $user->id,
        ]);

        if($brands){
            return response()->json([
                'status' => true,
                'message' => 'Brands have been created',
                'brands' => $brands
            ],200);
        }else{
            return response()->json([
                'status' => true,
                'message' => 'Brands not created',
            ],500);
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
    public function edit(Request $request,string $id)
    {
        $user = $request->user();
        $brands =Brand::find($id);
        if(!$brands){
            return response()->json([
                'status' => false,
                'message' => 'The requested brands does not exist',
            ],405);
        }
        if($user->role != 1 || $user->id != $brands->user_id){
            return response()->json([
                'status' => false,
                'message' => 'Unothoized request for brands single gitting',
            ],404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Single Brand fetched successfully',
            'brands' => $brands
        ],200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id){

        $validator =Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'slug' => 'required|unique:brands,slug,'.$id,
            ]
            );
        if($validator->fails()){
            return response()->json([
                'status' => false,
                'message' => 'All fields are required',
                'errors' =>$validator->errors()->all(),
            ],400);
        }

        $user = $request->user();
        $findBrand =Brand::find($id);

        if(!$findBrand){
            return response()->json([
                'status' => false,
                'message' => 'The requested brand does not exist',
            ],405);
        }
        if($user->role != 1 || $user->id != $findBrand->user_id){
            return response()->json([
                'status' => false,
                'message' => 'Unothorized request for brand update',
            ],404);
        }

        $brands =Brand::where('id','=', $id)->update([
            'name' => $request->name,
            'slug' => $request->slug,
            'status' => $request->status,
            'user_id' => $user->id,
        ]);

        if($brands){
            return response()->json([
                'status' => true,
                'message' => 'Brands updated successfully',
                'brands' => $brands
            ],200);
        }else{
            return response()->json([
                'status' => false,
                'message' => 'Brand not updated successfully',
            ],405);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request,string $id)
    {
        $user =$request->user();
        $brands =Brand::find($id);
        if(!$brands){
            return response()->json([
                'status' => false,
                'message' => 'The requested brand does not exist',
            ],405);
        }
        // if($user->role != 1 || $user->id != $brands->user_id){
        //     return response()->json([
        //         'status' => false,
        //         'message' => 'Unothorized request for brand deletion',
        //     ],404);
        // }

       $result = $brands->delete();
       if($result){
        return response()->json([
            'status' => true,
            'message' => 'Brands deleted successfully',
        ],200);
       }else{
        return response()->json([
            'status' => false,
            'message' => 'Brand not deleted',
        ],500);
       }

    }
}
