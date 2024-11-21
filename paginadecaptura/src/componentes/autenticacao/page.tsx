import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Utilizando apenas a validação do CPF
      const cpfValidationSchema = z.string().regex(/^\d{11}$/, "CPF inválido");
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
    <div className="flex flex-col-reverse md:flex-row md:h-screen relative">
      <div className="w-full md:w-1/2 md:relative md:my-auto max-w-[1300px] order-2 md:order-none">
        <Image
          src="/banner-login-1.png"
          alt="Banner Login"
          layout="responsive"
          width={1300}
          height={800}
          objectFit="cover"
          className="rounded-b-2xl md:rounded-r-2xl md:rounded-b-none object-left-top"
          priority
        />
      </div>
      <div className="flex flex-col px-9 gap-10 md:justify-center md:w-1/2 p-6 m-auto max-w-[60em]">
        <div className="mb-4 text-center order-3 md:order-none">
          <p className="text-gray-600 text-lg md:text-xl xl:text-2xl">
            Mantenha seus dados atualizados para que possamos sempre oferecer o melhor serviço e te manter sempre informado.
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
        <div className="flex justify-center xl:mt-4">
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