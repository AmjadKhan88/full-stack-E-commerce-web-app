<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\discountCoupon;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;

class DiscountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $keywords = $request->input('keywords', '');

        $discounts = discountCoupon::where('name', 'like', "%{$keywords}%")
            ->paginate(8);



        return response()->json([
            'status' => true,
            'message' => 'All discount coupon codes fetched',
            'discounts' => $discounts
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
        $validaor = Validator::make($request->all(),[
                'code' => 'required|unique:discount_coupons,code',
                'discount_amount' => 'required|numeric',
                'name' => 'unique:discount_coupons,name',
                'type' => 'required',
                'status' => 'required',
            ]
        );

        if($validaor->fails()){
            return response()->json([
                'status' => false,
                'message' => 'All fields are required',
                'errors' => $validaor->errors()->all(),
            ],405);
        }

        // cheack date vaildation for coupon expiry and start date
        if (!empty($request->starts_at)) {
            $now = Carbon::now();
            $start_at = Carbon::createFromFormat('Y-m-d H:i:s', $request->starts_at);
            if ($start_at->lte($now)) {
                return response()->json([
                    'status' => false,
                    'errors' => ['starts_at' => 'Start date can not be less than current date time'],
                ], 401);
            }
        }

        if (!empty($request->starts_at) && !empty($request->expires_at)) {
            $expirDate = Carbon::createFromFormat('Y-m-d H:i:s', $request->expires_at);
            $start_at = Carbon::createFromFormat('Y-m-d H:i:s', $request->starts_at);
            if ($expirDate->gt($start_at) == false) {
                return response()->json([
                    'status' => false,
                    'errors' => ['expires_at' => 'Expiry date must be greater than start date'],
                ], 401);
            }
        }

        $result = DiscountCoupon::create([
            'code' => $request->code,
            'name' => $request->name,
            'description' => $request->description,
            'max_uses' => $request->max_uses,
            'max_uses_user' => $request->max_uses_user,
            'type' => $request->type,
            'discount_amount' => $request->discount_amount,
            'min_amount' => $request->min_amount,
            'status' => $request->status,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
        ]);

        if($result){
            return response()->json([
                'status' => true,
                'message' => 'Discount has been created',
                'discount' => $result
            ],200);
        }else{
            return response()->json([
                'status' => true,
                'message' => 'Discount not created',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function getFrontDiscount(Request $request,string $id)
    {
        $code = discountCoupon::where('code',$id)->first();

        if(!$code){
            return response()->json([
                'status' => false,
                'message' => 'Discount coupon not found',
            ], 401);
        }

        // Cheack if coupon start date is valid or not
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, string $id)
    {
            $discount = discountCoupon::find($id);

            if($discount){
                return response()->json([
                    'status' => true,
                    'message' => 'Discount fetched successfully',
                    'discount' => $discount
                ], 200);
            }else{
            return response()->json([
                'status' => false,
                'message' => 'The requested discount was not found',
            ], 404);
            }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validaor = Validator::make(
            $request->all(),
            [
                'code' => 'required|unique:discount_coupons,code,'.$id,
                'discount_amount' => 'required|numeric',
                'name' => 'unique:discount_coupons,name,'.$id,
                'type' => 'required',
                'status' => 'required',
            ]
        );

        if ($validaor->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'All fields are required',
                'errors' => $validaor->errors()->all(),
            ], 405);
        }

        $discount = discountCoupon::find($id);

        if(!$discount){
            return response()->json([
                'status' => false,
                'message' => 'The requested discount is not found',
            ],404);
        }

        // cheack date vaildation for coupon expiry and start date
          if(!empty($request->starts_at)){
            $now = Carbon::now();
           $start_at= Carbon::createFromFormat('Y-m-d H:i:s',$request->starts_at);
            if($start_at->lte($now)){
                return response()->json([
                    'status' => false,
                    'errors' =>['starts_at' => 'Start date can not be less than current date time'],
                ],401);
            }
        }

        if(!empty($request->starts_at) && !empty($request->expires_at)){
            $expirDate = Carbon::createFromFormat('Y-m-d H:i:s', $request->expires_at);
            $start_at = Carbon::createFromFormat('Y-m-d H:i:s', $request->starts_at);
            if ($expirDate->gt($start_at) == false) {
                return response()->json([
                    'status' => false,
                    'errors' => ['expires_at' => 'Expiry date must be greater than start date'],
                ], 401);
            }
        }

        $result = discountCoupon::where('id',$id)->update([
            'code' => $request->code,
            'name' => $request->name,
            'description' => $request->description,
            'max_uses' => $request->max_uses,
            'max_uses_user' => $request->max_uses_user,
            'type' => $request->type,
            'discount_amount' => $request->discount_amount,
            'min_amount' => $request->min_amount,
            'status' => $request->status,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
        ]);

        if ($result) {
            return response()->json([
                'status' => true,
                'message' => 'Discount has been updatet',
                'discount' => $result
            ], 200);
        } else {
            return response()->json([
                'status' => true,
                'message' => 'Discount not updated',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $discount = discountCoupon::find($id);

        if($discount){
            $discount->delete();
            return response()->json([
                'status' => true,
                'message' => 'Discount deleted successfully',
            ], 200);
        }else{
            return response()->json([
                'status' => false,
                'message' => 'The requested discount was not found',
            ], 404);
        }
    }
}
