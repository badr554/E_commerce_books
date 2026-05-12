<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        // Get user from token (Sanctum) for IDOR Protection
        $user = auth('sanctum')->user();
        if (!$user) {
            return response()->json(['error' => 'Please login to checkout'], 401);
        }

        // Fetch only the cart items that belong to the authenticated user[cite: 1]
        $cartItems = CartItem::where('user_id', $user->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Your cart is empty'], 400);
        }

        // Create an order associated with the user_id for IDOR protection[cite: 1]
        $order = Order::create([
            'user_id' => $user->id,
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'total_amount' => 0,
            'status' => 'pending',
        ]);

        $lineItems = [];
        $totalAmount = 0;

        foreach ($cartItems as $item) {
            $totalAmount += ($item->product->price * $item->quantity);
            $lineItems[] = [
                'price' => $item->product->stripe_price_id,
                'quantity' => $item->quantity,
            ];

            // SAVE items to the permanent OrderItem table for history [cite: 71]
            \App\Models\OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'price' => $item->product->price,
                'quantity' => $item->quantity,
            ]);
        }

        $order->update(['total_amount' => $totalAmount]);

        // CLEAR the user's cart after creating the order [cite: 71]
        CartItem::where('user_id', $user->id)->delete();

        // Use the Frontend URL from the .env file
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        // Create the Stripe session with the exact URLs requested by the frontend team
        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => $frontendUrl . '/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $frontendUrl . '/cart',
            'metadata' => [
                'order_id' => $order->id,
                'user_id' => $user->id
            ]
        ]);

        $order->update(['stripe_session_id' => $session->id]);

        return response()->json(['url' => $session->url]);
    }
}
