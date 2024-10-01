<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    public function index(Request $request){
        $country = Country::all();
        return response()->json([
            'status' => true,
            'message' => 'Country Feached successfully',
            'country' => $country
        ],200);
    }
}
