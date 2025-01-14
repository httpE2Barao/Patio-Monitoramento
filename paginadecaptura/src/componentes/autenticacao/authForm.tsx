"use client";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import CryptoJS from "crypto-js";
import React, { useState } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { chamarApi } from "src/utils/chamarAPI";
import { CondominioSelect } from "../formulario/FormEndSelect";

interface AuthFormProps {
  isSignup: boolean;
  error: string;
  setError: (error: string) => void;
  handleSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
}

// Funções de validação
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

  const methods = useForm<FieldValues>({
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
    control,
  } = methods;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setError("");
  
    // Gera hash da senha e salva no localStorage (exemplo)
    const hashedPassword = CryptoJS.SHA256(data.password).toString();
    localStorage.setItem("hashedPassword", hashedPassword);
  
    const normalizeDoc = (cpf: string | null | undefined): string => {
      return (cpf || '').replace(/\D/g, '');
    };

    // Se for cadastro, verificar as senhas
    if (isSignup && data.password !== data.confirmPassword) {
      setError("As senhas não correspondem.");
      return;
    }
  
    // Se for cadastro (isSignup), vamos buscar moradores do condomínio para checar RG x CPF
    if (isSignup) {
      const condominio = data.condominio;
  
      if (!condominio || typeof condominio !== 'object' || !condominio.codigoCondominio) {
        setError("Por favor, selecione um condomínio válido.");
        return;
      }
  
      const mor_cond_id = condominio.codigoCondominio;
  
      try {
        // Usa a função chamarApi para listar moradores
        const response = await chamarApi("listar_moradores", {
          acao: "listar",
          mor_cond_id,
          mor_apto: "",
          mor_bloco: "",
        });
  
        const { resposta, Moradores } = response;
  
        // Se a API retornou um erro
        if (resposta && typeof resposta === "string") {
          setError(resposta);
          return;
        }
  
        // Verifique se 'Moradores' está presente e é um array
        if (!Moradores || !Array.isArray(Moradores)) {
          throw new Error("Resposta inválida da API ao listar moradores.");
        }
  
        // Compare o RG retornado com o CPF inserido.
        const normalizedCPF = normalizeDoc(data.cpf);
        let found = false;
        for (let index = 0; index < Moradores.length; index++) {
          const m = Moradores[index];
  
          const normalizedRG = normalizeDoc(m.rg);
  
          if (normalizedRG === normalizedCPF) {
            found = true;
            setError("Morador já existe, faça login.");
            return; // Interrompe o submit
          }
        }
  
        if (!found) {
          // Continue com o cadastro
        }
      } catch (err: any) {
        setError(err.error || "Não foi possível verificar seus dados no condomínio.");
        return;
      }
    }
  
    // Se passou pela verificação (ou se não é signup), chamamos o submit do pai
    await handleParentSubmit(data);
  };   

  return (
    <FormProvider {...methods}>
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

        {isSignup && (
          <CondominioSelect
            name="condominio"
            control={control} 
          />
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
          helperText={
            errors.password?.message ? String(errors.password.message) : ""
          }
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
                  validate: (value: string) => {
                    // Se a função retornar "weak", bloqueia a submissão
                    if (evaluatePasswordStrength(value) === "weak") {
                      return "A senha deve ter pelo menos força MÉDIA.";
                    }
                    if(value !== getValues("password")) {
                      return "As senhas não correspondem."
                    } 
                    return true; // Ok se for "medium" ou "strong"
                  },
                onChange: (e) => {
                  const strength = evaluatePasswordStrength(e.target.value);
                  setPasswordStrength(strength);
                }
              })}
              placeholder="Confirme sua senha"
              label="Confirme sua senha"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={
                errors.confirmPassword?.message ? String(errors.confirmPassword.message) : ""
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
    </FormProvider>
  );
};
