<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // أضف هذا السطر

class CartItem extends Model
{
    protected $fillable = [ 'product_id', 'quantity', 'user_id'];

    // هذه هي العلاقة التي يشتكي لارافيل من فقدانها
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
