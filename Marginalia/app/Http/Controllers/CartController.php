<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // add product to cart with user association and IDOR protection
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1'
        ]);

        //read user from token (Sanctum)
        $user = auth('sanctum')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        $userId = $user->id;

        //search for the product in this specific user's cart ensuring IDOR protection by filtering with user_id
        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            // update quantity if the product already exists in the cart
            $cartItem->increment('quantity', $request->quantity ?? 1);
        } else {
            // create a new cart item for this user
            $cartItem = CartItem::create([
                'user_id' => $userId,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity ?? 1,
            ]);
        }

        return response()->json([
            'message' => 'Product added to your secure cart',
            'cart' => $cartItem
        ]);
    }

    // update quantity of a cart item with IDOR protection to ensure users can only modify their own cart items
    // (+ , -)
    public function updateQuantity(Request $request)
    {
        $request->validate([
            'cart_item_id' => 'required|exists:cart_items,id',
            'action' => 'required|in:increase,decrease'
        ]);

        // IDOR Protection: Only find the item if it belongs to the logged-in user
        $cartItem = CartItem::where('id', $request->cart_item_id)
            ->where('user_id', auth('sanctum')->id())
            ->firstOrFail();

        if ($request->action === 'increase') {
            $cartItem->increment('quantity');
        } else {
            if ($cartItem->quantity > 1) {
                $cartItem->decrement('quantity');
            } else {
                $cartItem->delete();
                return response()->json(['message' => 'Item removed from cart']);
            }
        }
        return response()->json(['message' => 'Quantity updated', 'quantity' => $cartItem->quantity]);
    }

    // delete an item from the cart with strict IDOR protection to ensure users can only delete their own cart items
    public function removeItem($id)
    {
        // IDOR Protection: Only delete if the item belongs to the logged-in user
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', auth('sanctum')->id())
            ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Item not found or unauthorized'], 404);
        }

        $cartItem->delete();
        return response()->json(['message' => 'Item removed from cart successfully']);
    }
}
