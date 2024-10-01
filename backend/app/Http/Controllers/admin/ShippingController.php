<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\ShippingCharge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ShippingController extends Controller
{
    // Get shipping charges
    public function index(Request $request)
    {
        $keywords = $request->input('keywords', '');

        $charges = ShippingCharge::with('country')
            ->whereHas('country', function ($query) use ($keywords) {
                $query->where('name', 'like', "%{$keywords}%");
            })
            ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Shipping charges fetched successfully',
            'shipping' => $charges
        ], 200);
    }

    // Store the shipping charges
    public function store(Request $request){

        $validator = Validator::make($request->all(), [
            'country' => 'required|unique:shipping_charges,country_id',
            'amount' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'All fields are required',
                'errors' => $validator->errors()->all(),
            ],400);
        }

        $result = ShippingCharge::create(
            [
                'country_id' => $request->country,
                'amount' => $request->amount
            ]
            );

        if($result){
            return response()->json([
                'status' => true,
                'message' => 'Shipping charges created successfully',
                'shipping' => $result
            ],200);
        }else{
            return response()->json([
                'status' => false,
                'message' => 'Shipping charges not created',
            ], 500);
        }

    }

    // update shipping charges
    public function update(Request $request, string $id)
    {

        $validator = Validator::make($request->all(), [
            'country_id' => 'required|unique:shipping_charges,country_id,'.$id,
            'amount' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'All fields are required',
                'errors' => $validator->errors()->all(),
            ], 400);
        }

        $charges = ShippingCharge::find($id);
        if(!$charges){
            return response()->json([
                'status' => false,
                'message' => 'The requested shipping charges are invalid',

            ],404);
        }

        $result = ShippingCharge::where('id',$id)->update(
            [
                'country_id' => $request->country_id,
                'amount' => $request->amount
            ]
        );

        if ($result) {
            return response()->json([
                'status' => true,
                'message' => 'Shipping charges update successfully',
                'shipping' => $result
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Shipping charges not updated',
            ], 500);
        }

    }

    // Get signle shipping rates
    public function edit(Request $request, string $id){
            $shipping = ShippingCharge::find($id);

            if($shipping){
                return response()->json([
                    'status' => true,
                    'message' => 'Shipping charges get successfully',
                    'shipping' => $shipping
                ],200); 
            }else{
            return response()->json([
                'status' => false,
                'message' => 'Shipping charges Not found',
            ], 401);
        }
    }

    // delete shipping charges
    public function destroy(Request $request, string $id)
    {
        $user = $request->user();
        $shipping = ShippingCharge::find($id);
        if (!$shipping) {
            return response()->json([
                'status' => false,
                'message' => 'The requested brand does not exist',
            ], 405);
        }
        // if($user->role != 1 || $user->id != $shipping->user_id){
        //     return response()->json([
        //         'status' => false,
        //         'message' => 'Unothorized request for brand deletion',
        //     ],404);
        // }

        $result = $shipping->delete();
        if ($result) {
            return response()->json([
                'status' => true,
                'message' => 'ShippingCharges deleted successfully',
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Shipping charges not deleted',
            ], 500);
        }

    }
}
