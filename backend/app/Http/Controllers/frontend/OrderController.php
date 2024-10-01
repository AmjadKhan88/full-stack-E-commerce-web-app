<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use App\Models\CustomerAddresses;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\ShippingCharge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
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
        
        // step 1: validate the request
        $validator = Validator::make($request->all(),[
                'first_name' => 'required|max:30',
                'last_name' => 'required|max:20',
                'email' => 'required|email',
                'country' => 'required',
                'address' => 'required|min:5|max:150',
                'city' => 'required|max:50',
                'state' => 'required|max:50',
                'zip' => 'required|max:40',
                'phone' => 'required|max:20'
        ]);

        // return response if validator fails
        if($validator->fails()){
            return response()->json([
                'status' => false,
                'message' => 'All field are required',
                'errors' => $validator->errors()->all()
            ],401);
        }
        $auth = $request->user();
                    //** */
        // step 2 save customer info
                    //** */

        CustomerAddresses::updateOrCreate(['user_id' => $auth->id],
           [
            'user_id' => $auth->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'country_id' => $request->country,
            'address' => $request->address,
            'apartment' => $request->apartment,
            'city' => $request->city,
            'state' => $request->state,
            'zip' => $request->zip,
            'mobile' => $request->phone,
           ]
        );

                    //** */
        // step 3 store data in orders table
                    //** */
        if(!empty($request->cod)){
           $shipping = 0;
           $discount = 0;
           $subTotal = $request->sub_total;
           $grandTotal = $subTotal+$shipping;

           // order information
           $order = new Orders;
           $order->subtotal = $subTotal;
           $order->shipping = $shipping;
           $order->grand_total = $grandTotal;
           $order->user_id = $auth->id;

           // user information
           $order->first_name = $request->first_name;
           $order->last_name = $request->last_name;
           $order->email = $request->email;
           $order->country_id = $request->country;
           $order->address = $request->address;
           $order->state = $request->state;
           $order->city = $request->city;
           $order->zip = $request->zip;
           $order->mobile = $request->phone;
           $order->apartment = $request->apartment;
           $order->notes = $request->notes;

           $order->save();

                    //** */
            // step - 4 store order items in order order_items table
                    //** */

            $cartItems = json_decode($request->items, true); // Decode as an associative array

            if (is_array($cartItems)) {
                foreach ($cartItems as $item) {
                    $orderItem = new OrderItems;
                    $orderItem->product_id = $item['id']; // Access array with square brackets
                    $orderItem->order_id = $order->id;
                    $orderItem->name = $item['title'];
                    $orderItem->qty = $item['quantity'];
                    $orderItem->price = $item['price'];
                    $orderItem->total = $item['price'] * $item['quantity'];

                    $orderItem->save();
                }
            } else {
                return response()->json(['error' => 'Invalid cart data'], 400);
            }

            // return response for successfull ordering request
            return response()->json([
                'status' => true,
                'message' => 'Order placed successfully',
                'orderId' => $order->id,
            ],200);
        }else{

        }
        
    }

    /**
     * Display the specified resource.
     */
    public function getShippingChares(Request $request, string $id)
    {
         $shopingCharge = ShippingCharge::where('country_id', $id)->get()->first();

         return response()->json([
                'status' => true,
                'charge' => $shopingCharge
         ],200);
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
