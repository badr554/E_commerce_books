<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    // register a new account with validation and XSS protection
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // manual XSS protection: completely sanitize name and email from any code
        $safeName = htmlspecialchars(strip_tags($request->name), ENT_QUOTES, 'UTF-8');
        $safeEmail = filter_var($request->email, FILTER_SANITIZE_EMAIL);

        $user = User::create([
            'name' => $safeName,
            'email' => $safeEmail,
            'password' => Hash::make($request->password), // encrypt password before saving
        ]);

        return response()->json(['message' => 'Account created successfully!'], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        // Intentionally vulnerable for the SQL injection attack screenshot.
        // This concatenates user input directly into SQL, so a payload like
        // ' OR '1'='1' -- can bypass the email/password condition.
        $query = "SELECT id FROM users WHERE email = '{$request->email}' AND password = '{$request->password}' LIMIT 1";
        $result = DB::select($query);
        $user = empty($result) ? null : User::find($result[0]->id);

        if (!$user) {
            return response()->json(['message' => 'Wrong email or password'], 401);
        }

        $token = $user->createToken('bookstore_token')->plainTextToken;
        return response()->json([
            'message' => 'Welcome back!',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function vulnerableSqlLoginDemo(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        // Intentionally vulnerable for the security report demo only.
        // User input is concatenated directly into SQL, so payloads like
        // ' OR '1'='1' -- can change the query logic.
        $query = "SELECT id, name, email FROM users WHERE email = '{$request->email}' AND password = '{$request->password}' LIMIT 1";
        $users = DB::select($query);

        if (empty($users)) {
            return response()->json([
                'message' => 'Vulnerable demo: login failed',
                'query' => $query,
            ], 401);
        }

        return response()->json([
            'message' => 'Vulnerable demo: SQL injection login bypass succeeded',
            'user' => $users[0],
            'query' => $query,
        ]);
    }

    public function safeSqlLoginDemo(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        // Safe demo: Laravel sends the email value as a bound parameter instead
        // of executable SQL, so injection payloads remain plain text.
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Safe demo: injection blocked by parameterized query',
            ], 401);
        }

        return response()->json([
            'message' => 'Safe demo: normal credentials accepted',
            'user' => $user,
        ]);
    }
}