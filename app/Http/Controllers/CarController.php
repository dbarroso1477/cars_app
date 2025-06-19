<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $query = Car::with('color');

        if ($request->brand) {
            $query->where('brand', $request->brand);
        }

        if ($request->model) {
            $query->where('model', $request->model);
        }

        if ($request->color) {
            $query->whereHas('color', fn($q) => $q->where('name', $request->color));
        }

        if ($request->year) {
            $query->where('year', $request->year);
        }

        return $query->orderBy('created_at', 'desc')->paginate(5);
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

    public function filters()
    {
        return response()->json([
            'brands' => Car::select('brand')->distinct()->pluck('brand'),
            'models' => Car::select('model')->distinct()->pluck('model'),
            'years'  => Car::select('year')->distinct()->pluck('year')->sortDesc()->values(),
            'colors' => \App\Models\Color::select('id', 'name')->get(),
        ]);
    }
}
