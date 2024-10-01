<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $admin = $request->user();
        if($admin->role == 1){
            $users = User::paginate(10);
            return response()->json([
                'status' => true,
                'message' => 'All User petched from record',
                'users' => $users
            ]);
        }else{
            return response()->json([
                'status' => false,
                'message' => 'you have not access for this',
            ],405);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validater = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'email' => 'required|email|unique:users,email',
                'password' => 'required',
                'image' => 'image',
                
            ]
        );

        if ($validater->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'validation failed',
                'errors' => $validater->errors()->all(),
            ], 401);
        }
        $role = 0;
        $imageName = "";
        if ($request->file('image') != '') {
            $img = $request->file('image');
            $ext = $img->getClientOriginalExtension();
            $imageName = time() . '.' . $ext;
            $img->move(public_path() . '/uploads', $imageName);
        }

        $phone = "";
        $address = "";

        if(!empty($request->phone)){
            $phone = $request->phone;
        }
        if(!empty($request->address)){
            $address = $request->address;
        }

        if ($request->role != '') {
            $role = $request->role;
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => $request->password,
            'image' => $imageName,
            'address' => $address,
            'phone' => $phone
        ]);

        if ($user) {
            return response()->json([
                'status' => true,
                'message' => 'Signup successful completed',
                'user' => $user
            ], 201);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong',
                'user' => $user
            ], 500);
        }


    }

    /**
     * login a user with token api.
     */

    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {

            $token = Auth::user()->createToken("API TOKEN")->plainTextToken;

            $data = json_encode([
                'token' => $token,
                'user' => $user = Auth::user(),
            ]);

                 // Set the token and user data as a secure, HTTP-only cookie
        $cookie = Cookie::make(
            'user_data',  // Cookie name
            $data,        // Cookie value
            10080,           // Minutes until expiration
            null,         // Path
            null,         // Domain
            true,         // Secure (only transmitted over HTTPS)
            true,         // HTTP only (not accessible via JavaScript)
            false,        // Raw
            'Strict'      // SameSite attribute
        );

            return response()->json([
                'status' => true,
                'message' => 'successfully logged in',
                'token' => $token,
                'user' => Auth::user(),
                'token_type' => 'bearer',
            ], 201)->cookie($cookie);

        } else {
            return response()->json([
                'status' => false,
                'message' => 'Email or password incorrect try again',

            ], 401);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request,string $id)
    {
        $userToken = $request->user();

        if($userToken->role == 1 || $userToken->id == $id){
            $user = User::find($id);
            if($user){
            return response()->json([
                'status' => true,
                'message' => 'User fetched successfully',
                'user' => $user,
            ]);
        }else{
            return response()->json([
                'status' => false,
                'message' => 'User not found',
            ],401);
        }
        }else{
            return response()->json([
                'status' => false,
                'message' => 'you not allowed to access this user',
            ],405);
        }
    }

    // fetch user details for home page

    public function userFetch (Request $request, string $token){
        $token = $request->bearerToken();


        $user = $request->user();

        if($user){
            return response()->json([
                'status' => true,
                'message' => 'Single user fetch successfully',
                'user' => $user,
                'web_token' => $token
            ],200);
        }else{
            return response()->json([
                'status' => false,
                'message' => 'Please login again and try again',
            ],405);	
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Access and decode the cookie
        $cookieData = $request->cookie('user_data');
        $data = json_decode($cookieData, true);

        if($data || $request->user()){
        $tokenUser = $request->user();

        if ($tokenUser->role == 1 || $tokenUser->id == $id) {

            // cheack the user exists or not
            $user = User::find($id);
            if($user){
                  // Validate the request data
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'image' => 'image'
            ]);

            if($validator->fails()){
                return response()->json([
                    'status' => false,
                    'message' => 'All fields are required',
                    'errors' => $validator->errors()->all(),
                ],401);
            }


            $role = 0;
            $imageName = $user->image;

            if ($request->hasFile('image')) {
                $filePath = public_path('uploads/' . $imageName);
                if (File::exists($filePath)) {
                    File::delete($filePath);
                }
        
                $img = $request->file('image');
                $ext = $img->getClientOriginalExtension();
                $imageName = time() . '.' . $ext;
                $img->move(public_path() . '/uploads', $imageName);
            }

            if($tokenUser->role == 1){
                $role = $request->role;
            }

            $phone = $user->phone;
            $address = $user->address;

            if(!empty($request->phone)){
                $phone = $request->phone;
            }
            if(!empty($request->address)){
                $address = $request->address;
            }

            $insertUser = User::where('id',$id)->update([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $role,
                'image' => $imageName,
                'address' => $address,
                'phone' => $phone
            ]);

            if($insertUser){
                return response()->json([
                    'status' => true,
                    'message' => 'Successfully updated user',
                    'user' => User::find($id),
                ],201);
            }else{
                return response()->json([
                    'status' => false,
                    'message' => 'User can not updated',
                    
                ],500);
            }


            }else{
                return response()->json([
                    'status' => false,
                    'message' => 'User not found or invalid info',
                ],405);
            }
       } else {
            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials login again and then try again',
           ],403);
        }
    }else{
        return response()->json([
            'status' => false,
            'message' => 'Invalid credentials please login',
        ],404);
    }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $admin = $request->user();


        if ($admin->role == 1) {
            $user = User::find($id);
            if ($user) {
                $user->delete();
                return response()->json([
                    'status' => true,
                    'message' => 'Successfully deleted',
                    'user' => $user
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Not Found or Invalid',
                    'error' => 'this' . $id . ' id not found',
                ], 401);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'You are not allowed to delete',
            ], 405);
        }
    }


    // logout user from website

    public function logout(Request $request)
    {
        $user = $request->user();
        $cookie = Cookie::forget('user_data');
        $user->tokens()->delete();


        return response()->json([
            'status' => true,
            'message' => 'Logged out successfully',
        ], 200);
    }
}
