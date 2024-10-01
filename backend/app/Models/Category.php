<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'user_id',
        'image',
        'status',
        'show_on_top'
    ];

    public function subCategory(){
        return $this->hasMany(SubCategoy::class);
    }

    public function products()
{
    return $this->hasMany(Product::class);
}

}
