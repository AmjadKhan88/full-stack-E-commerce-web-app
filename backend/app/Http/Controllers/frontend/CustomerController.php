<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\CustomerAddresses;
use Auth;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function getAddress(Request $request)
    {
        // $auth = Auth::guard('sanctum')->user();
        $auth = $request->user();

        if(!$auth){
            return response()->json([
                'status' => false,
                'message' => 'You are not allowed to access this please login',
            ],405);
        }

        $user = CustomerAddresses::where('user_id',$auth->id)->first();

        return response()->json([
            'status' => true,
            'message' => 'Customer address has been fetched',
            'user' => $user
        ],200);
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
