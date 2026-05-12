<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // get all products with no sensitive data exposure and proper JSON formatting for React frontend
    public function GET_all_products()
    {
        //get all products without exposing any sensitive data and return as JSON for React frontend
        $products = Product::all();

        //return only necessary fields to the frontend to avoid any sensitive data exposure and ensure proper JSON formatting for React
        return response()->json($products);
    }
}
