<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Exception;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    /**
     * Redirect the user to Google's OAuth login page.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->stateless() // Disable session state for API compatibility
            ->redirect();
    }

    /**
     * Handle the callback from Google after authentication.
     */
    public function handleGoogleCallback()
    {
        try {
            // Retrieve user information from Google using stateless mode
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->user();

            // Check if user data or email was successfully received
            if (!$googleUser || !$googleUser->getEmail()) {
                return redirect("http://localhost:5173/login?error=no_user_data");
            }

            // Create or update the user in the database based on their email
            $user = User::updateOrCreate(
                [
                    'email' => $googleUser->getEmail(),
                ],
                [
                    'name' => $googleUser->getName() ?? $googleUser->getNickname(), // Use name or fallback to nickname
                    'google_id' => $googleUser->getId(), // Store the unique Google ID
                    'password' => bcrypt(str()->random(16)), // Generate a random password for security
                ]
            );

            // Generate a secure API token using Laravel Sanctum
            $token = $user->createToken('bookstore_token')->plainTextToken;

            // Prepare user data for the URL by encoding it properly
            $userData = urlencode(json_encode([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]));

            // Redirect to the React frontend instead of returning JSON
            // The frontend will extract the token and user data from the URL parameters
            return redirect("http://localhost:5173/login?token={$token}&user={$userData}");
        } catch (Exception $e) {
            // Handle any technical errors during the authentication process
            return redirect("http://localhost:5173/login?error=" . urlencode($e->getMessage()));
        }
    }
}
