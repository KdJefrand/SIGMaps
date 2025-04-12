<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <div id="map" class="w-full h-96 shadow-lg rounded-lg overflow-hidden"></div>

                    <div class="mt-4 flex">
                        <h2 id="detailText" class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {{ __('Detail: Klik pada peta untuk melihat alamat') }}
                        </h2>
                    </div>
                    <div class="mt-4 flex">
                        <h2 id="detailText" class="font-semibold text-xl text-red-800 dark:text-red-200 leading-tight">
                            {{ __('Klik kanan pada objek untuk menghapus objek') }}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    </div>

</x-app-layout>
