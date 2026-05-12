<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface; // لا تنسى إضافة هذا السطر في الأعلى

class Product extends Model
{
    use HasFactory;

    /**
     * Prepare a date for array / JSON serialization.
     * هذا الكود يضمن أن الوقت سيظهر بتوقيت القاهرة المضبط في config/app
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    protected $fillable = [
    'name',
    'description',
    'price',
    'stripe_product_id', // أضف هذا
    'stripe_price_id',   // أضف هذا
    'image_url'
];

}
