<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class discountCoupon extends Model
{
    use HasFactory;

    protected $fillable = [
            'code',
            'name',
            'discount_amount',
            'description',
            'max_uses',
            'max_uses_user',
            'type',
            'starts_at',
            'expires_at',
            'status',
    ];
}
