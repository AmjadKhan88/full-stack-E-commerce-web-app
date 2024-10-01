<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Http\Middleware\HandleCors;

class MiddlewareServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register any services or middleware here
    }

    public function boot()
    {
        
    }
}
