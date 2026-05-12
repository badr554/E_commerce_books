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
        $table->string('name'); // اسم الكتاب
        $table->text('description')->nullable(); // وصف الكتاب
        $table->integer('price'); // السعر بالسنتات (88.96 دولار تخزن كـ 8896) [cite: 131]
        $table->string('image_url')->nullable(); // رابط الصورة
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
