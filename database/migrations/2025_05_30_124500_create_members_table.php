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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('wallet_address');
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->enum('membership_status', ['active', 'inactive', 'suspended']);
            $table->date('joining_date');
            $table->enum('gender', ['male', 'female']);
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('stand_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
