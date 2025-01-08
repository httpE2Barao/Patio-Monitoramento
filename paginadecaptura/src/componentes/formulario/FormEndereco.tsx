import {
  Grid,
  TextField
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { Schema } from "../schema-zod";
import { CondominioSelect } from "./FormEndSelect";
import { Titulo } from "./titulo";

interface FormEnderecoProps {
  isAptoDisabled: boolean;
}

export const FormEndereco: React.FC<FormEnderecoProps> = ({ isAptoDisabled }) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<Schema>();

  // Monitorar os valores dos campos para desabilitação
  const codigoCondominio = watch("endereco.condominio.codigoCondominio");
  const aptoValue = watch("endereco.apto");

  return (
    <Grid item xs={12}>
      <Titulo titulo="Endereço" />
      <Grid container key={0} spacing={2}>
        <Grid item xs={12} md={6}>
        <CondominioSelect name="condominio" disabled={false} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register("endereco.apto")} 
            label="Apartamento e Bloco"
            placeholder="Exemplo: 55 B1"
            fullWidth
            error={!!errors.endereco?.apto}
            helperText={errors.endereco?.apto?.message || "Digite o bloco em seguida do apartamento se existir."}
            disabled={isAptoDisabled} 
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
