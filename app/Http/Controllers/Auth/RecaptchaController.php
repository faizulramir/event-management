<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecaptchaController extends Controller
{
    /**
     * Verify a reCAPTCHA token with Google's reCAPTCHA API
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $token = $request->input('token');
        $secretKey = config('services.recaptcha.secret_key');

        try {
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secretKey,
                'response' => $token,
                'remoteip' => $request->ip(),
            ]);

            $responseData = $response->json();

            if ($response->successful() && isset($responseData['success']) && $responseData['success']) {
                // You can also check the score for v3 reCAPTCHA if needed
                // $score = $responseData['score'] ?? 0;
                // if ($score < 0.5) { // Adjust threshold as needed
                //     return response()->json(['verified' => false, 'message' => 'reCAPTCHA score too low'], 400);
                // }

                return response()->json(['verified' => true]);
            } else {
                Log::warning('reCAPTCHA verification failed', $responseData);
                return response()->json(['verified' => false, 'message' => 'reCAPTCHA verification failed'], 400);
            }
        } catch (\Exception $e) {
            Log::error('reCAPTCHA verification error: ' . $e->getMessage());
            return response()->json(['verified' => false, 'message' => 'Error verifying reCAPTCHA'], 500);
        }
    }
}