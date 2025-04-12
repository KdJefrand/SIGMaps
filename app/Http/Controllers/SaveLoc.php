<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SavedLoc;

class SaveLoc extends Controller
{
    public function saveLoc(Request $request)
    {
        SavedLoc::create([
            'geojson' => json_encode($request->input('geojson')),
            'popup_text' => $request->input('popup_text'),
            'user_id' => auth()->id()
        ]);

        return response()->json(['status' => 'success']);
    }

    public function getLocations()
    {
        $locations = SavedLoc::all();
        return response()->json($locations);
    }

    public function deleteLocation($id)
    {
        $location = SavedLoc::find($id);
        if (!$location) {
            return response()->json(['status' => 'error', 'message' => 'Lokasi tidak ditemukan'], 404);
        }

        $location->delete();
        return response()->json(['status' => 'success', 'message' => 'Lokasi berhasil dihapus']);
    }
}
