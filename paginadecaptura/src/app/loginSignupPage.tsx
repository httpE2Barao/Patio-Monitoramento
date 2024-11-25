import axios from 'axios';
import { AuthForm } from 'componentes/autenticacao/authForm';
import Image from 'next/image';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const LoginSignupPage: React.FC = () => {  
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggleForm = () => {
    setIsSignup(!isSignup);
    setError('');
  };

  const handleSubmit = async (data: any) => {
    setError('');
    setLoading(true);
  
    const { cpf, password } = data;
  
    try {
      let response;
  
      if (isSignup) {
        response = await axios.post(process.env.API_URL_CRIAR_SENHA!, {
          cpf,
          senha: password,
        });
      } else {
        response = await axios.post(process.env.API_URL_LOGIN!, { cpf, password });
      }
  
      if (response.data.resposta === "Senha criada com sucesso" || response.data.exists) {
        navigate('/dashboard');
      } else {
        setError(response.data.resposta || 'Credenciais inválidas ou usuário não encontrado.');
      }
  
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Erro de validação');
      } else if (axios.isAxiosError(err)) {
        console.error('Erro na requisição:', err.response?.data);
        setError(err.response?.data?.error || 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.');
      } else {
        setError('Erro desconhecido. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
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
          className="rounded-b-2xl md:rounded-r-2xl md:rounded-b-none object-left-top"
          priority
        />
      </div>
      <div className="flex flex-col px-7 gap-5 2xl:gap-20 md:justify-center md:w-1/2 p-6 m-auto max-w-[60em]">
        <div className="mb-4 text-center order-3 md:order-none">
          <p className="text-gray-600 text-lg px-7 md:text-xl xl:text-2xl">
            Mantenha seus dados atualizados para que possamos oferecer o melhor serviço e te manter sempre informado.
          </p>
        </div>
        <AuthForm
          isSignup={isSignup}
          error={error}
          setError={setError}
          handleSubmit={handleSubmit}
          loading={loading}
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