import {
    Button,
    TextField
} from "@mui/material";
import { CondominioSelect } from "componentes/formulario/FormEndSelect";
import React, { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

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
    handleSubmit: SubmitHandler<FieldValues>;
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
    handleSubmit: handleParentSubmit,
}) => {
    const { control, handleSubmit: handleFormSubmit, register } = useForm();
    const [passwordStrength, setPasswordStrength] = useState<string>('');
    const [condominios, setCondominios] = useState<{ codigoCondominio: string; nomeCondominio: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [cpfError, setCpfError] = useState<string>('');

    useEffect(() => {
        if (cpf) {
            if (isValidCPF(cpf)) {
                setCpfError('');
                setError('');
            } else {
                setCpfError('CPF inválido.');
                setError(''); // Não afeta outros campos
            }
        }
    }, [cpf, setError]);

    useEffect(() => {
        if (password) {
            setPasswordStrength(password);
        } else {
            setPasswordStrength('');
        }
    }, [password]);

    useEffect(() => {
        const fetchCondominios = async () => {
            try {
                const response = await fetch("/api/condominios");
                if (!response.ok) {
                    throw new Error(
                        `Erro ao obter condomínios: ${response.status} ${response.statusText}`
                    );
                }
                const data = await response.json();
                setCondominios(data.condominios);
            } catch (error) {
                console.error("Erro ao obter condomínios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCondominios();
    }, []);

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleParentSubmit(e); }} className="flex flex-col gap-4 px-10 min-lg:h-[50vh]">
            <h2 className='text-2xl font-medium'>{isSignup ? 'Cadastro' : 'Login'}</h2>
            <CondominioSelect 
                control={control} 
                error={''}
                loading={loading} 
                condominios={condominios} 
            />
            <TextField
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF"
                className="p-2 border border-blue-500 rounded"
                label="CPF"
                fullWidth
                error={!!cpfError}
                helperText={cpfError}
            />
            <TextField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="p-2 border border-blue-500 rounded"
                label="Senha"
                fullWidth
            />
            {isSignup && (
                <TextField
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    className="p-2 border border-blue-500 rounded"
                    label="Confirme sua senha"
                    fullWidth
                />
            )}
            <Button
                type="submit"
                variant="contained"
                color="primary"
            >
                {isSignup ? 'Cadastrar' : 'Entrar'}
            </Button>
        </form>
    );
};