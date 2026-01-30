<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->string('name', 256)->nullable(false);
            $table->string('address', 512)->nullable(false);
            $table->string('phone', 20)->nullable(true);
            $table->string('email', 256)->nullable(true);
            $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
            $table->foreignId('cuisine_id')->constrained('cuisines')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
