<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedLoc extends Model
{
    use HasFactory;

    protected $table = 'saved_locs';

    protected $fillable = [
        'type',
        'popup_text',
        'geojson',
        'center_lat',
        'center_lng',
        'user_id',
        'label',
    ];

    protected $casts = [
        'geojson' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
