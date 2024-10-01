<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingCharge extends Model
{
    use HasFactory;

    protected $fillable =[
        'country_id',
        'amount',
    ];


    public function country(){
        return $this->belongsTo(Country::class,'country_id');
    }
}
