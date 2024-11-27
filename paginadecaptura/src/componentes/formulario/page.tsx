"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { schema, Schema } from "../schema-zod";
import { FormEndereco } from "./FormEndereco";
import { FormFeedback } from "./FormFeedback";
import { FormResidentes } from "./FormResidentes";
import { FormRetorno } from "./FormRetorno";
import { FormVeiculo } from "./FormVeiculo";

interface FormProps {
  cpf: string | null;
  senha: string | null;
}

export const Form: React.FC<FormProps> = ({ cpf, senha }) => {
  const methods = useForm<Schema>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      endereco: { condominio: "", apto: "" },
      residentes: [
        { nome: "", telefone: [""], email: "", tipoDocumento: "CPF", documento: "", parentesco: "" },
      ],
      veiculos: [{ cor: "", modelo: "", placa: "" }],
      feedback: "",
    },
  });

  const { fields: residentesFields } = useFieldArray({
    name: "residentes",
    control: methods.control,
  });

  const { fields: veiculosFields } = useFieldArray({
    name: "veiculos",
    control: methods.control,
  });

  const [retornoForm, setRetornoForm] = useState<boolean | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const { reset, trigger, control, formState, setValue } = methods;

  const tipoDocumento = useWatch({
    name: "residentes",
    control,
  });

  useEffect(() => {
    if (
      tipoDocumento &&
      formState.touchedFields.residentes?.some((residente) => residente?.tipoDocumento)
    ) {
      trigger("residentes");
    }
  }, [tipoDocumento, trigger, formState.touchedFields.residentes]);

  const onSubmit = async (data: Schema) => {
    if (!cpf || !senha) {
      console.error("CPF ou senha não encontrados no localStorage. O usuário precisa estar autenticado.");
      return;
    }

    setLoading(true);
    try {
      // Inclui o CPF e a senha nos dados do formulário antes de enviar
      const dataWithCredentials = {
        ...data,
        cpf,
        senha,
      };

      // Faz a requisição para a API usando o endpoint específico definido no .env
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL_MORADOR!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithCredentials),
      });

      if (response.ok) {
        setRetornoForm(true);
        // Limpa o localStorage após o envio bem-sucedido
        localStorage.removeItem("formData");
      } else {
        setRetornoForm(false);
        console.error("Erro ao enviar dados:", response.statusText);
      }
    } catch (error) {
      setRetornoForm(false);
      console.error("Erro ao enviar dados:", error);
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <Container>
      <FormProvider {...methods}>
        <form className="flex gap-2 flex-col items-center justify-evenly" onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid container spacing={1} sx={{ pb: 4, maxWidth: "100%", m: "auto" }}>
            <Grid item xs={12}>
              <FormEndereco />
            </Grid>
            <Grid item xs={12}>
              {residentesFields.map((item, index) => (
                <FormResidentes key={item.id} index={index} />
              ))}
            </Grid>
            <Grid item xs={12}>
              {veiculosFields.map((item, index) => (
                <FormVeiculo key={item.id} index={index} />
              ))}
            </Grid>
            <Grid item xs={12}>
              <FormFeedback />
            </Grid>
            <Grid item xs={12}>
              <span className="flex justify-center items-center mt-2">
                {loading ? <CircularProgress /> : <FormRetorno enviado={retornoForm} />}
              </span>
            </Grid>
            <Grid item xs={12} sx={{ mt: 3, justifyContent: "space-around", display: "flex" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  reset();
                  setRetornoForm(undefined);
                  localStorage.removeItem("formData");
                }}
                sx={{ ml: 2, fontSize: "large" }}
              >
                Limpar
              </Button>
              <Button type="submit" variant="contained" sx={{ fontSize: "large" }}>
                Enviar
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Container>
  );
};
