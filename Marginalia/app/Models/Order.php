<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    // ALLOW mass assignment for these fields (important for creating orders from the checkout process) [cite: 71]
    protected $fillable = [
        'user_id', // Add this
        'customer_name',
        'customer_email',
        'total_amount',
        'status',
        'stripe_session_id',
    ];

    // Added relationship to link order to the user [cite: 71]
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
