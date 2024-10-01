<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $casts = [
        'images' => 'array',
        'related_products' => 'json',
    ];
    protected $fillable =[
        'title',
        'description',
        'short_description',
        'shipping_returns',
        'featured_image',
        'images',
        'status',
        'price',
        'compare_price',
        'is_featured',
        'track_qty',
        'related_products',
        'sku',
        'barcode',
        'qty',
        'user_id',
        'category_id',
        'sub_category_id',
        'brand_id',
        'slug',
    ];

    public function setRelatedProductsAttribute($value)
    {
        if (is_array($value)) {
            // If the value is an array, encode it as a JSON string
            $this->attributes['related_products'] = json_encode($value);
        } else {
            // If the value is a comma-separated string, convert it to an array and then encode it
            $array = explode(',', $value);
            $this->attributes['related_products'] = json_encode($array);
        }
    }

    public function getRelatedProductsAttribute($value)
{
    return json_decode($value, true); // Decode JSON into an array
}


    public function category (){
        return $this->belongsTo(Category::class);
    }

    public function user (){
        return $this->belongsTo(User::class);
    }

    public function brands (){
        return $this->belongsTo(Brand::class);
    }
    public function sub_category (){
        return $this->belongsTo(SubCategoy::class);
    }
}
