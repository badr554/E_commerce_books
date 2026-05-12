<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // حذف الأعمدة اللي مش محتاجينها في الـ API
            $table->dropColumn(['email_verified_at', 'remember_token']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // لو حبيت ترجعهم تاني مستقبلاً
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
        });
    }
};
