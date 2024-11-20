import { residenteBaseSchema } from 'app/api/schema-zod';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthForm } from './authForm';

const LoginSignupPage: React.FC = () => {  
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [cpf, setCpf] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleToggleForm = () => {
    setIsSignup(!isSignup);
    setError('');
  };

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
  }, [cpf]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Utilizando o esquema base para validar o CPF
      const cpfValidationSchema = residenteBaseSchema.shape.documento;
      cpfValidationSchema.parse(cpf);

      if (isSignup && password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }

      if (isSignup) {
        await axios.post('/api/clientes/signup', { cpf, password });
        navigate('/dashboard');
      } else {
        const response = await axios.get(`/api/clientes/login?cpf=${cpf}&password=${password}`);
        if (response.data.exists) {
          navigate('/dashboard');
        } else {
          setError('Credenciais inválidas ou usuário não encontrado.');
        }
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Erro de validação');
      } else {
        setError('Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(/public/banner-login-2.png)' }}
      ></div>
      <div className="flex flex-col justify-center md:w-1/2 p-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Dashboard do Cliente</h2>
          <p className="text-gray-600">
            Atualize seus dados para que possamos estar sempre conectados e entregar o melhor serviço.
          </p>
        </div>
        <AuthForm
          isSignup={isSignup}
          cpf={cpf}
          setCpf={setCpf}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          error={error}
          setError={setError}
          handleSubmit={handleSubmit}
        />
        <div className="flex justify-center mt-4">
          <button
            onClick={handleToggleForm}
            className="text-blue-500 underline hover:text-blue-700 transition-colors duration-300"
          >
            {isSignup ? 'Já sou cliente' : 'Não tem uma conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;
