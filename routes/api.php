<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarController;

Route::middleware('api')->group(function () {
    Route::apiResource('cars', CarController::class);
});

Route::get('/colors', function () {
    return \App\Models\Color::all();
});
