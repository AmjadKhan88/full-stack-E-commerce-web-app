<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class FrontendCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $Category = Category::with(['subCategory' => function($query) {
            $query->whereHas('products', function($query) {
                $query->where('status', '=', 1);
            });
        }])
        ->whereHas('products', function($query) {
            $query->where('status', '=', 1);
        })
        ->where('status', '=', 1)
        ->orderBy('name', 'ASC')
        ->get();
    
        return response()->json([
            'status' => true,
            'message' => 'All active categories with associated products fetched successfully',
            'category' => $Category
        ], 200);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function topNavCategory(Request $request)
    {
        $category =Category::with('subCategory')->where('show_on_top','=','Yes')->orderBy('name','ASC')->get();

        return response()->json([
            'status' => true,
            'message' => 'All active Category top category fetched successfully',
            'category' => $category
        ],200);
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
