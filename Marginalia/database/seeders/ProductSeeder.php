<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            ['name' => 'The Silent Library', 'price' => 1899],
            ['name' => 'Recipes from a Slow Kitchen', 'price' => 2899],
            ['name' => 'The Hour Before Dawn', 'price' => 1299],
            ['name' => 'Quiet Machines', 'price' => 2799],
            ['name' => 'Saltwater Hours', 'price' => 1499],
            ['name' => 'The Glassmaker of Murano', 'price' => 1999],
            ['name' => 'Code & Cathedral', 'price' => 2499],
            ['name' => 'Wildflowers of the Pyrenees', 'price' => 3299],
            ['name' => 'The Psychology of Money', 'price' => 2000],
            ['name' => 'Milk and Honey', 'price' => 1500],
            ['name' => 'The Midnight Rose', 'price' => 2150],
            ['name' => 'Echoes of the Void', 'price' => 1775],
            ['name' => 'Urban Botany', 'price' => 2500],
            ['name' => 'Architecture of Dreams', 'price' => 3500],
            ['name' => 'The Alchemist Path', 'price' => 1850],
            ['name' => 'Digital Renaissance', 'price' => 2999],
            ['name' => 'Whispers in the Wind', 'price' => 1100],
            ['name' => 'Beyond the Horizon', 'price' => 2200],
            ['name' => 'The Art of Simplicity', 'price' => 1950],
            ['name' => 'Starlight Chronicles', 'price' => 2650],
        ];

        foreach ($books as $book) {
            Product::create([
                'name' => $book['name'],
                'price' => $book['price'],
                //convert spaces to %20 to ensure the URL works in browsers and with Stripe
                'image_url' => url('Images/' . rawurlencode($book['name']) . '.png'),
            ]);
        }
    }
}
