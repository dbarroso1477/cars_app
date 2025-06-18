<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
     protected $fillable = ['brand', 'model', 'color_id', 'year'];

         public function color()
          {
               return $this->belongsTo(Color::class);
          }
}
