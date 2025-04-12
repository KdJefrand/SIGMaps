<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SaveLoc;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/save-loc', [SaveLoc::class, 'SaveLoc']);
    Route::get('/get-locations', [SaveLoc::class, 'getLocations']);
    Route::delete('/delete-location/{id}', [SaveLoc::class, 'deleteLocation']);
});

require __DIR__.'/auth.php';
