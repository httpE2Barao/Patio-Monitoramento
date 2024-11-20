import { residenteBaseSchema } from 'app/api/schema-zod';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';

interface AuthFormProps {
    isSignup: boolean;
    cpf: string;
    setCpf: (cpf: string) => void;
    password: string;
    setPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (confirmPassword: string) => void;
    error: string;
    setError: (error: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const evaluatePasswordStrength = (password: string): string => {
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:,.<>?]).{10,}$/;
    const mediumPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (strongPasswordPattern.test(password)) {
        return 'strong';
    } else if (mediumPasswordPattern.test(password)) {
        return 'medium';
    } else {
        return 'weak';
    }
};

export const AuthForm: React.FC<AuthFormProps> = ({
    isSignup,
    cpf,
    setCpf,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    handleSubmit,
}) => {
    const [passwordStrength, setPasswordStrength] = useState<string>('');

    // Validação do CPF enquanto o usuário está digitando
    useEffect(() => {
        if (cpf) {
            try {
                const cpfValidationSchema = residenteBaseSchema.shape.documento;
                cpfValidationSchema.parse(cpf);
                setError(''); // Limpa o erro se o CPF for válido
            } catch (err) {
                if (err instanceof z.ZodError) {
                    setError(err.errors[0]?.message || 'Erro de validação');
                }
            }
        }
    }, [cpf, setError]);

    // Avaliação da força da senha enquanto o usuário está digitando
    useEffect(() => {
        if (password) {
            const strength = evaluatePasswordStrength(password);
            setPasswordStrength(strength);
        } else {
            setPasswordStrength('');
        }
    }, [password]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSignup && passwordStrength === 'weak') {
            setError('A senha deve ter pelo menos 8 caracteres, uma letras maiúscula e uma minúscula e um número.');
            return;
        }
        handleSubmit(e);
    };

    return (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 px-10 min-lg:h-[50vh]">
            <h2 className='text-2xl font-medium'>{isSignup ? 'Cadastro' : 'Login'}</h2>
            {error && <div className="text-red-500">{error}</div>}
            <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF"
                className="p-2 border rounded"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="p-2 border rounded"
            />
            {isSignup && (
                <div className="text-sm text-gray-600">
                    Força da senha: <span className={
                        passwordStrength === 'strong' ? 'text-green-600' :
                        passwordStrength === 'medium' ? 'text-yellow-600' :
                        'text-red-600'
                    }>
                        {passwordStrength === 'strong' ? 'Forte' :
                        passwordStrength === 'medium' ? 'Média' :
                        'Fraca'}
                    </span>
                </div>
            )}
            {isSignup && (
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    className="p-2 border rounded"
                />
            )}
            <button
                type="submit"
                className="bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-300"
            >
                {isSignup ? 'Cadastrar' : 'Entrar'}
            </button>
        </form>
    );
};