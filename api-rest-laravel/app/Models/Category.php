<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    
    
    protected $table = 'categories';
    
//    RELACIÓN DE UNO A MUCHOS
    public function posts(){
        return $this->hasMany('App\Models\Post');
    }
}
