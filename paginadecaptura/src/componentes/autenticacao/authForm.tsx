import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

interface AuthFormProps {
  isSignup: boolean;
  error: string;
  setError: (error: string) => void;
  handleSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
}

const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

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
  error,
  setError,
  handleSubmit: handleParentSubmit,
  loading,
}) => {
  const router = useRouter();
  const {
    handleSubmit: handleFormSubmit,
    register,
    getValues,
    formState: { errors }
  } = useForm<FieldValues>({
    mode: 'onChange',
  });

  const [passwordStrength, setPasswordStrength] = useState<string>('');
  const [isProcessingSignup, setIsProcessingSignup] = useState<boolean>(false);

  const onSubmit = async (data: FieldValues) => {
    setError(""); 
  
    if (isSignup) {
      if (data.password !== data.confirmPassword) {
        setError('As senhas não correspondem.');
        return;
      }
  
      try {
        // 1) Verifica se usuário existe através de uma chamada de LOGIN
        const loginCheck = await axios.post(`/api/proxy`, {
          action: "login",
          payload: {
            cpf: data.cpf,
            senha: data.password,
          },
        });
  
        // loginCheck.status = 200, mas precisamos analisar loginCheck.data.resposta
        const respostaLogin = loginCheck.data?.resposta || "";
  
        // Se a resposta contiver algo indicando login bem-sucedido, o usuário já existe.
        // Ajuste conforme a resposta real do seu backend em caso de sucesso no login.
        if (
          respostaLogin.includes("login realizado com sucesso") ||
          respostaLogin.includes("ok") ||
          loginCheck.data?.status === "ok"
        ) {
          setError("Usuário já existe! Faça login em vez de cadastrar.");
          return;
        }
  
        // Caso a resposta contenha "Erro! Não foi localizado nenhum morador" ou "Erro!CPF ou Senha inválido:"
        // interpretamos que o usuário NÃO existe ainda, então podemos continuar com o signup.
        if (
          respostaLogin.includes("Não foi localizado nenhum morador") ||
          respostaLogin.includes("CPF ou Senha inválido")
        ) {
          // Aqui, de fato, seguimos com o SIGNUP (pois esse usuário não existe)
        } else {
          // Se não for nenhuma das opções acima, tratamos como erro.
          setError("Erro inesperado ao verificar usuário: " + respostaLogin);
          return;
        }
  
      } catch (err: any) {
        // Se cair no catch, houve um erro HTTP diferente de 2xx.
        // Trate aqui, se necessário. Mas provavelmente você não vai cair aqui 
        // se o backend retorna status 200 mesmo com erro.
        const mensagemErro = err?.response?.data?.resposta || err?.response?.data?.error || err.message;
        setError("Erro ao verificar usuário: " + mensagemErro);
        return;
      }
  
      // 2) Prossegue com o fluxo normal de signup (somente se a verificação acima permitiu)
      setIsProcessingSignup(true);
      try {
        const response = await axios.post(`/api/proxy`, {
          action: "signup",
          payload: {
            cpf: data.cpf,
            senha: data.password,
          },
        });
      
        if (response.status === 200) {
          if (response.data.resposta?.includes("já criou a senha de acesso")) {
            setError(response.data.resposta);
          } else {
            // === Chamada para /api/auth gera o cookie JWT ===
            await axios.post('/api/auth', {
              cpf: data.cpf,
              senha: data.password,
            });
            
            // Nesse momento, o cookie 'authToken' foi definido no header da resposta
            // O navegador salva esse cookie, e o usuário já está autenticado.
            router.push("/form");
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.resposta || "Erro ao tentar criar a conta. Tente novamente mais tarde.");
      }
       finally {
        setIsProcessingSignup(false);
      }
  
    } else {
      // Fluxo de login
      handleParentSubmit(data);
    }
  };

  return (
    <form onSubmit={handleFormSubmit(onSubmit)} className="flex flex-col gap-4 px-10 min-lg:h-[50vh]">
      <h2 className='text-2xl font-medium'>{isSignup ? 'Cadastro' : 'Login'}</h2>
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      <TextField
        {...register('cpf', {
          required: 'CPF é obrigatório.',
          validate: (value) => isValidCPF(value) || 'CPF inválido.',
        })}
        placeholder="CPF"
        label="CPF"
        fullWidth
        error={!!errors.cpf}
        helperText={errors.cpf?.message ? String(errors.cpf.message) : ''}
      />
      <TextField
        type="password"
        {...register('password', {
          required: 'Senha é obrigatória.',
          onChange: (e) => {
            const strength = evaluatePasswordStrength(e.target.value);
            setPasswordStrength(strength);
          }
        })}
        placeholder="Senha"
        label="Senha"
        fullWidth
        error={!!errors.password}
        helperText={errors.password?.message ? String(errors.password.message) : ''}
      />
      {isSignup && (
        <>
          <Typography variant="body2" className="text-sm text-gray-600">
            Força da senha: <span className={
              passwordStrength === 'strong' ? 'text-green-600' :
              passwordStrength === 'medium' ? 'text-yellow-600' :
              'text-red-600'
            }>
              {passwordStrength === 'strong' ? 'Forte' :
              passwordStrength === 'medium' ? 'Média' :
              'Fraca'}
            </span>
          </Typography>
          <TextField
            type="password"
            {...register('confirmPassword', {
              required: 'Confirmação de senha é obrigatória.',
              validate: (value) =>
                value === getValues('password') || 'As senhas não correspondem.',
            })}
            placeholder="Confirme sua senha"
            label="Confirme sua senha"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message ? String(errors.confirmPassword.message) : ''}
          />
        </>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading || isProcessingSignup}
      >
        {loading || isProcessingSignup ? <CircularProgress size={24} color="inherit" /> : isSignup ? 'Cadastrar' : 'Entrar'}
      </Button>
    </form>
  );
};
