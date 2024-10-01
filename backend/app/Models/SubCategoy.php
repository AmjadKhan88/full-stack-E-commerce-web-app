<?php

namespace App\Models;

use App\Models\Category;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubCategoy extends Model
{
    use HasFactory;

    protected $fillable =[
        'name',
        'slug',
        'category_id',
        'user_id',
        'status',
    ];

    public function category (){
        return $this->belongsTo(Category::class);
    }

    public function products()
{
    return $this->hasMany(Product::class, 'sub_category_id');
}

}
