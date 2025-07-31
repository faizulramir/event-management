<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RecaptchaController;

Route::post('/recaptcha/verify', [RecaptchaController::class, 'verify']);
