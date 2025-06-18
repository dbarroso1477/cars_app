<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index()
    {
        return Car::with('color')->orderBy('created_at', 'desc')->paginate(5);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'color_id' => 'required|integer|exists:colors,id',
            'year'  => 'required|integer|between:1900,' . date('Y'),
        ]);

        return Car::create($validated);
    }

    public function update(Request $request, Car $car)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'color_id' => 'required|integer|exists:colors,id',
            'year'  => 'required|integer|between:1900,' . date('Y'),
        ]);

        $car->update($validated);
        return response()->json($car);
    }

    public function destroy(Car $car)
    {
        $car->delete();
        return response()->json(['message' => 'Car deleted']);
    }
}
