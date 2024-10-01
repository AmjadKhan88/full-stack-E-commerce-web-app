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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->text('shipping_returns')->nullable();
            $table->string('featured_image');
            $table->json('images')->nullable();
            $table->integer('status')->default(1);
            $table->double('price',10,2);
            $table->double('compare_price',10,2)->nullable();
            $table->enum('is_featured',['Yes','No'])->default('No');
            $table->enum('track_qty',['Yes','No'])->default('Yes');
            $table->json('related_products')->nullable();
            $table->string('sku');
            $table->string('barcode')->nullable();
            $table->integer('qty')->nullable();
            $table->foreignId('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreignId('category_id')->references('id')->on('categories')->cascadeOnDelete();
            $table->foreignId('sub_category_id')->nullable()->references('id')->on('sub_categoys')->cascadeOnDelete();
            $table->foreignId('brand_id')->nullable()->references('id')->on('brands')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
