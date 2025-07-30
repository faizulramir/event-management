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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('location')->nullable();
            $table->integer('max_attendees')->nullable();
            $table->boolean('is_public')->default(false);
            $table->enum('status', ['draft', 'active', 'cancelled', 'completed'])->default('draft');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->index(['start_date', 'end_date']);
            $table->index(['status', 'is_public']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
