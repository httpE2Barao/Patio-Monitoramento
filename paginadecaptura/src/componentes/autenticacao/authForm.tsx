import React, { useEffect, useState } from 'react';

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

// Função para verificar se o CPF é válido
const isValidCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        // Verifica se tem 11 dígitos e se não é uma sequência repetida
        return false;
    }

    let sum = 0;
    let remainder;

    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
};

// Função para avaliar a força da senha
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
            if (isValidCPF(cpf)) {
                setError(''); // Limpa o erro se o CPF for válido
            } else {
                setError('CPF inválido.');
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

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      
        // Perform front-end validations here
        if (isSignup && passwordStrength === 'weak') {
          setError('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número.');
          return;
        }
        if (isSignup && password !== confirmPassword) {
          setError('As senhas não coincidem.');
          return;
        }
      
        try {
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cpf,
              password,
              isSignup,
            }),
          });
      
          const data = await response.json();
      
          if (!response.ok) {
            setError(data.error || 'Erro ao autenticar.');
          } else {
            // Authentication successful, redirect to '/form'
            window.location.href = '/form';
          }
        } catch (error) {
          setError('Erro ao comunicar com o servidor.');
          console.error(error);
        }
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
                className="p-2 border border-blue-500 rounded"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="p-2 border border-blue-500 rounded"
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
                    className="p-2 border border-blue-500 rounded"
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
