<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => [
                'required',
                'string',
                'max:50',
                'unique:users,username',
                'regex:/^[a-zA-Z0-9_]+$/', // Cho phép chữ, số, dấu gạch dưới
            ],
            'name' => [
                'required',
                'string',
                'max:50',
            ],
            'email' => [
                'required',
                'email',
                'unique:users,email',
                'not_regex:/@example\.com$/i', // Không cho phép email từ @example.com
            ],
            'password' => [
                'required',
                'min:8',
                'regex:/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/', // Phải có ít nhất 1 chữ in hoa và 1 số
                'confirmed',
            ],
        ];
    }

    public function messages()
    {
        return [
            'username.required' => 'Tên không được để trống.',
            'username.max' => 'Tên không được dài quá 50 ký tự.',
            'username.regex' => 'Tên chỉ được chứa chữ cái , số và dấu gạch dưới.',
            'username.unique' => 'Username đã được sử dụng.',
            'name.required' => 'Tên không được để trống.',
            'name.max' => 'Tên không được dài quá 50 ký tự.',
            'email.required' => 'Email không được để trống.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email đã được sử dụng.',
            'email.not_regex' => 'Email không được sử dụng domain @example.com.',
            'password.required' => 'Mật khẩu không được để trống.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.regex' => 'Mật khẩu phải có ít nhất 1 chữ cái in hoa, 1 số và một ký tự đặc biệt.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
