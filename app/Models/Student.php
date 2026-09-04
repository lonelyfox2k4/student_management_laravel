<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'student_code',
        'name',
        'age',
    ];

    /**
     * Các lớp mà sinh viên đã đăng ký
     */
    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class, 'enrollments')
                    ->withPivot('enrolled_at')
                    ->withTimestamps();
    }

    /**
     * Các bản ghi đăng ký lớp của sinh viên
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }
}
