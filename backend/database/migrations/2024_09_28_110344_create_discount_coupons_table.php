<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('discount_coupons', function (Blueprint $table) {
            $table->id();
            // discount coupon code 
            $table->string('code');
            // human readable coupon code name
            $table->string('name')->nullable();
            // description of coupon code
            $table->text('description')->nullable();
            // the Max uses this discount coupon has 
            $table->integer('max_uses')->nullable();
            // how many time user can use this discount coupon
            $table->integer('max_uses_user')->nullable();
            // the coupon code is a percentage or fixed price
            $table->enum('type',['percent','fixed'])->default('fixed');
            // the amount of discount based on the type
            $table->double('discount_amount',10,2);
            // check status of the discount is active or not active
            $table->integer('status')->default(1);
            // when the coupon begins
            $table->timestamp('starts_at');
            // when the coupon ends
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discount_coupons');
    }
};
