<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Get all orders for the authenticated user.
     * This API supports Image 1 (Orders list) and Image 2 (Empty state).
     */
    public function getMyOrders()
    {
        $user = auth('sanctum')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $orders = Order::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {

                // GET items for each order from the permanent OrderItem table [cite: 71]
                $order->items = \App\Models\OrderItem::where('order_id', $order->id)
                    ->get()
                    ->map(function ($item) {
                        return [
                            'product_name' => $item->product_name,
                            'quantity' => $item->quantity,
                            'price' => $item->price / 100 // TRANSFORM price from cents to dollars
                        ];
                    });

                // TRANSFORM total_amount from cents to dollars for better readability in the frontend
                $order->display_total = $order->total_amount / 100;

                return $order;
            });

        return response()->json($orders);
    }
}
