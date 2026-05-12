<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // هننادي فقط على الـ ProductSeeder عشان يملا الكتب
        $this->call([
            ProductSeeder::class,
        ]);
    }
}
