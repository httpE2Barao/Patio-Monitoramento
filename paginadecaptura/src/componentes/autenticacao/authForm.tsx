"use client";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import CryptoJS from "crypto-js";
import { useState } from "react";

interface AuthFormProps {
  isSignup: boolean;
  error: string;
  setError: (error: string) => void;
  handleSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
}

const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

const evaluatePasswordStrength = (password: string): string => {
  const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:,.<>?]).{10,}$/;
  const mediumPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (strongPasswordPattern.test(password)) {
    return "strong";
  } else if (mediumPasswordPattern.test(password)) {
    return "medium";
  } else {
    return "weak";
  }
};

export const AuthForm: React.FC<AuthFormProps> = ({
  isSignup,
  error,
  setError,
  handleSubmit: handleParentSubmit,
  loading,
}) => {
  const [passwordStrength, setPasswordStrength] = useState<string>("");

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: "onChange",
  });
  
  const onSubmit = (data: FieldValues) => {
    setError("");
  
    // Gera hash e salva no localStorage (se realmente quer fazer isso no filho)
    const hashedPassword = CryptoJS.SHA256(data.password).toString();
    localStorage.setItem("hashedPassword", hashedPassword);
  
    // Se for cadastro, verificar as senhas
    if (isSignup && data.password !== data.confirmPassword) {
      setError("As senhas não correspondem.");
      return;
    }
  
    // Chama a função do pai. O pai vai fazer a chamada real ao backend.
    handleParentSubmit(data);
  };  

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-10 min-lg:h-[50vh]"
    >
      <h2 className="text-2xl font-medium">
        {isSignup ? "Cadastro" : "Login"}
      </h2>

      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}

      <TextField
        {...register("cpf", {
          required: "CPF é obrigatório.",
          validate: (value) => isValidCPF(value) || "CPF inválido.",
        })}
        placeholder="CPF"
        label="CPF"
        fullWidth
        error={!!errors.cpf}
        helperText={errors.cpf?.message ? String(errors.cpf.message) : ""}
      />

      <TextField
        type="password"
        {...register("password", {
          required: "Senha é obrigatória.",
          onChange: (e) => {
            const strength = evaluatePasswordStrength(e.target.value);
            setPasswordStrength(strength);
          },
        })}
        placeholder="Senha"
        label="Senha"
        fullWidth
        error={!!errors.password}
        helperText={errors.password?.message ? String(errors.password.message) : ""}
      />

      {isSignup && (
        <>
          <Typography variant="body2" className="text-sm text-gray-600">
            Força da senha:{" "}
            <span
              className={
                passwordStrength === "strong"
                  ? "text-green-600"
                  : passwordStrength === "medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {passwordStrength === "strong"
                ? "Forte"
                : passwordStrength === "medium"
                ? "Média"
                : "Fraca"}
            </span>
          </Typography>

          <TextField
            type="password"
            {...register("confirmPassword", {
              required: "Confirmação de senha é obrigatória.",
              validate: (value) =>
                value === getValues("password") || "As senhas não correspondem.",
            })}
            placeholder="Confirme sua senha"
            label="Confirme sua senha"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword?.message
                ? String(errors.confirmPassword.message)
                : ""
            }
          />
        </>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : isSignup ? (
          "Cadastrar"
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
};
