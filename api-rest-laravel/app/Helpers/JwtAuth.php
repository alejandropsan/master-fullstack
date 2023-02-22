<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class JwtAuth{

    public $key;

    public function __construct() {
        $this->key = "esto_es_una_clave_super_secreta-99887766";
    }

    public function signup($email, $password, $getToken = null){

        // Buscar si existe el usuario con sus credenciales
        $user = User::where([
            'email' => $email,
            'password' => $password
        ])->first();


        // Comprobar si son correctas y nos devuelve un objeto
        $signup = false;
        if(is_object($user)){
            $signup = true;
        }


        // Generar el token con los datos del usuario identificado
        if($signup){

            $token = array(
              'sub'     =>      $user->id,
              'email'   =>      $user->email,
              'name'    =>      $user->name,
              'surname' =>      $user->surname,
              'description' =>  $user->description,
              'image'   =>      $user->image,
              'iat'     =>      time(),
              'exp'     =>      time() + (7 * 24 * 60 * 60)
            );

            $jwt = JWT::encode($token, $this->key, 'HS256');
            $decoded = JWT::decode($jwt, new Key($this->key, 'HS256'));

            // Devolver los datos decodificados o el token, en función de un parámetro
            if(is_null($getToken)){
                $data = $jwt;
            }else {
                $data = $decoded;
            }


        }else{
            $data = array(
                'status' => 'error',
                'message' => 'Login incorrecto'
            );
        }


        return $data;
    }



    public function checkToken($jwt, $getIdentity = false){
        $auth = false;

        try{
            $jwt = str_replace('"', '', $jwt);
            $decoded = JWT::decode($jwt, new Key($this->key, 'HS256'));
        } catch (\UnexpectedValueException $ex) {
            $auth = false;
        } catch (\DomainException $ex){
            $auth = false;
        }

        if(!empty($decoded) && is_object($decoded) && isset($decoded->sub)){
            $auth = true;
        }else {
            $auth = false;
        }

        if($getIdentity){
            return $decoded;
        }

        return $auth;

    }




}
