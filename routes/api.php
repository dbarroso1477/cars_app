<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarController;
use App\Http\Controllers\AuthController;


// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
    Route::get('/cars/filters', [CarController::class, 'filters']);
    Route::apiResource('cars', CarController::class);
    Route::get('/colors', fn () => \App\Models\Color::all());


// Rutas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Logged out']);
})->middleware('auth:sanctum');
});
