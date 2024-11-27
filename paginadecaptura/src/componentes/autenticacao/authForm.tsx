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
    setError(""); // Limpar o erro anterior

    if (isSignup) {
      if (data.password !== data.confirmPassword) {
        setError('As senhas não correspondem.');
        return;
      }

      setIsProcessingSignup(true);
      try {
        // Fazendo a requisição de signup via proxy
        const response = await axios.post(`/api/proxy`, {
          action: "signup",
          cpf: data.cpf,
          senha: data.password,
        });

        if (response.status === 200) {
          if (response.data.resposta.includes("já criou a senha de acesso")) {
            setError(response.data.resposta);
          } else {
            // Armazena CPF e senha no localStorage e redireciona para /form
            localStorage.setItem("authToken", response.data.token);
            localStorage.setItem("cpf", data.cpf);
            localStorage.setItem("senha", data.password);
            router.push("/form");
          }
        }
      } catch (err: any) {
        // Caso ocorra um erro ao fazer a requisição
        setError(err.response?.data?.resposta || "Erro ao tentar criar a conta. Tente novamente mais tarde.");
      } finally {
        setIsProcessingSignup(false);
      }
    } else {
      // Caso seja login
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
