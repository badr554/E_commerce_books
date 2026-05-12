<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WebhookController; // Import Webhook controller
use App\Http\Controllers\SocialiteController; // Import Socialite controller
use App\Http\Controllers\OrderController; // Import Order controller

// 1. Public routes (no authentication required)

// Get all products
Route::get('/get_products', [ProductController::class, 'GET_all_products']);

// Register a new user
Route::post('/register', [AuthController::class, 'register']);

// Login user
Route::post('/login', [AuthController::class, 'login']);

// SQL injection report demos. These do not issue real auth tokens.
Route::post('/sql-lab/login-vulnerable', [AuthController::class, 'vulnerableSqlLoginDemo']);
Route::post('/sql-lab/login-safe', [AuthController::class, 'safeSqlLoginDemo']);

// Google OAuth login redirect
Route::get('/auth/google', [SocialiteController::class, 'redirectToGoogle']);

// Google OAuth callback handler
Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback']);

// Stripe webhook endpoint (must be public and not protected by auth middleware)
Route::post('/webhook', [WebhookController::class, 'handle']);

// // Payment success route (used after successful payment)
// Route::get('/payment/success', function () {
//     return response()->json(['message' => 'Payment Successful! Your order is being processed.']);
// });

// // Payment cancel route (used when payment is canceled)
// Route::get('/payment/cancel', function () {
//     return response()->json(['message' => 'Payment Canceled.']);
// });


//---------------------------------------------------------------------



// 2. Protected routes (require authentication via Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Add item to cart
    Route::post('/cart/add', [CartController::class, 'addToCart']);

    // Update cart item quantity
    Route::post('/cart/update', [CartController::class, 'updateQuantity']);

    // Remove item from cart
    Route::delete('/cart/remove/{id}', [CartController::class, 'removeItem']);

    // Stripe checkout payment request
    Route::post('/Pay_with_Stripe_checkout', [CheckoutController::class, 'checkout']);

    // New Route for "My Orders" Screen
    Route::get('/my-orders', [OrderController::class, 'getMyOrders']);

    // Get authenticated user data
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
