<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class VerifyEmailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'exists:users,id'],
            'hash' => ['required', 'string'],
        ];
    }

    public function messages()
    {
        return [
            'id.required' => 'ID không được để trống.',
            'id.exists' => 'Người dùng không tồn tại.',
            'hash.required' => 'Hash không được để trống.',
            'hash.string' => 'Hash phải là chuỗi ký tự.',
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
