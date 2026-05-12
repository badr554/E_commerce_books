<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class WebhookController extends Controller
{
    // Handle incoming Stripe webhook requests
    public function handle(Request $request)
    {
        // Get raw request payload from Stripe
        $payload = $request->getContent();

        // Get Stripe signature from request headers
        $sig_header = $request->header('Stripe-Signature');

        // Retrieve webhook secret from environment variables
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        try {
            // Validate and construct the Stripe event
            $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (SignatureVerificationException $e) {
            // Return error if signature is invalid
            return response()->json(['error' => 'Invalid Signature'], 400);
        }

        // Handle successful checkout session event
        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;

            // Update order status in database to "paid"
            Order::where('stripe_session_id', $session->id)
                ->update(['status' => 'paid']);
        }

        // Return success response to Stripe
        return response()->json(['status' => 'success']);
    }
}
