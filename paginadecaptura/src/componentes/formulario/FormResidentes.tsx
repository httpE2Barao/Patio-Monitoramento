import { Autocomplete, Button, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Schema } from "../schema-zod";
import { Titulo } from "./titulo";

export interface FormNumberProps {
  index: number;
}

export const FormResidentes: React.FC<FormNumberProps> = () => {
  const { control, register, formState: { errors }, setValue, getValues, watch } = useFormContext<Schema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "residentes"
  });

  const [parentescos, setParentescos] = useState<{ id: number, value: string }[]>([]);
  const [cpfFromStorage, setCpfFromStorage] = useState<string | null>(null);

  // Assistindo alterações nos residentes para garantir sincronia dos valores
  const residentes = watch("residentes");

  useEffect(() => {
    // Buscar o CPF do localStorage
    const cpf = localStorage.getItem("cpf");
    if (cpf) {
      setCpfFromStorage(cpf);
      setValue(`residentes.0.documento`, cpf); // Preencher automaticamente o campo de documento do primeiro residente
      setValue(`residentes.0.tipoDocumento`, "CPF"); // Definir o tipo de documento do primeiro residente como "CPF"
    }
  }, [setValue]);

  useEffect(() => {
    fetch("/parentescos.json")
      .then(res => res.json())
      .then(data => setParentescos(data))
      .catch(err => console.error("Erro ao carregar os parentescos:", err));
  }, []);

  // Forçar sincronização automática dos telefones após carregar valores
  useEffect(() => {
    fields.forEach((field, index) => {
      const currentTelefones = getValues(`residentes.${index}.telefone`);
      if (!currentTelefones || currentTelefones.length === 0) {
        setValue(`residentes.${index}.telefone`, [""]); // Inicializa com uma lista vazia
      } else {
        setValue(`residentes.${index}.telefone`, currentTelefones); // Garante que telefones não estejam "em branco"
      }
    });
  }, [fields, residentes, getValues, setValue]);

  return (
    <>
      <Titulo titulo="Residentes" />
      {fields.map((field, index) => {
        const telefones = getValues(`residentes.${index}.telefone`) || [""];

        const handleAddTelefone = () => {
          if (telefones.length < 3) {
            const newTelefones = [...telefones, ""];
            setValue(`residentes.${index}.telefone`, newTelefones);
          }
        };

        const handleRemoveTelefone = (phoneIndex: number) => {
          const newTelefones = telefones.filter((_, idx) => idx !== phoneIndex);
          setValue(`residentes.${index}.telefone`, newTelefones);
        };

        const handleTelefoneChange = (phoneIndex: number, value: string) => {
          const newTelefones = telefones.map((telefone, idx) =>
            idx === phoneIndex ? value : telefone
          );
          setValue(`residentes.${index}.telefone`, newTelefones);
        };

        return (
          <Grid container spacing={2} key={field.id} sx={{ mt: index > 0 ? 4 : 0 }}>
            <Grid item xs={12} md={6} className="pt-4">
              <TextField
                {...register(`residentes.${index}.nome` as const)}
                label="Nome"
                fullWidth
                error={!!errors.residentes?.[index]?.nome}
                helperText={errors.residentes?.[index]?.nome?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name={`residentes.${index}.parentesco`}
                control={control}
                rules={{ required: "O campo de parentesco é obrigatório" }}
                render={({ field: { value, ...field } }) => (
                  <Autocomplete
                    {...field}
                    options={parentescos}
                    getOptionLabel={(option) => option.value}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, newValue) => {
                      field.onChange(newValue?.value || "");
                    }}
                    renderInput={(params) => <TextField {...params} label="Nível de parentesco" fullWidth />}
                  />
                )}
              />
              {errors.residentes?.[index]?.parentesco && (
                <p className="text-xs pt-1 text-red-600 pl-4">{errors.residentes?.[index]?.parentesco?.message}</p>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register(`residentes.${index}.email` as const)}
                label="Email"
                fullWidth
                error={!!errors.residentes?.[index]?.email}
                helperText={errors.residentes?.[index]?.email?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              {telefones.map((telefone, phoneIndex) => (
                <div key={phoneIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <TextField
                    label={`Telefone ${phoneIndex + 1}`}
                    fullWidth
                    value={telefone}
                    onChange={(e) => handleTelefoneChange(phoneIndex, e.target.value)}
                    error={!!errors.residentes?.[index]?.telefone?.[phoneIndex]}
                    helperText={errors.residentes?.[index]?.telefone?.[phoneIndex]?.message}
                  />
                  {telefones.length < 3 && phoneIndex === telefones.length - 1 && (
                    <Button
                      variant="text"
                      onClick={handleAddTelefone}
                      style={{ marginLeft: '8px', minWidth: '40px' }}
                    >
                      +
                    </Button>
                  )}
                  {telefones.length > 1 && (
                    <Button
                      variant="text"
                      onClick={() => handleRemoveTelefone(phoneIndex)}
                      style={{ marginLeft: '8px', minWidth: '40px' }}
                    >
                      -
                    </Button>
                  )}
                </div>
              ))}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register(`residentes.${index}.documento` as const)}
                label="Documento"
                fullWidth
                value={index === 0 && cpfFromStorage ? cpfFromStorage : getValues(`residentes.${index}.documento`)}
                onChange={(e) => {
                  if (index !== 0) {
                    setValue(`residentes.${index}.documento`, e.target.value);
                  }
                }}
                error={!!errors.residentes?.[index]?.documento}
                helperText={errors.residentes?.[index]?.documento?.message}
                InputProps={{
                  readOnly: index === 0, // Apenas para o primeiro residente
                }}
              />
              {index === 0 ? (
                <RadioGroup row sx={{ justifyContent: "space-around" }}>
                  <FormControlLabel value="CPF" control={<Radio checked={true} />} label="CPF" />
                </RadioGroup>
              ) : (
                <Controller
                  name={`residentes.${index}.tipoDocumento`}
                  control={control}
                  rules={{ required: 'Selecione um tipo de documento válido' }}
                  render={({ field }) => (
                    <RadioGroup {...field} row sx={{ justifyContent: "space-around" }}>
                      <FormControlLabel value="RG" control={<Radio />} label="RG" />
                      <FormControlLabel value="CPF" control={<Radio />} label="CPF" />
                      <FormControlLabel value="CNH" control={<Radio />} label="CNH" />
                    </RadioGroup>
                  )}
                />
              )}
              {errors.residentes?.[index]?.tipoDocumento && (
                <p className="text-xs pt-1 text-red-600 pl-4">{errors.residentes?.[index]?.tipoDocumento?.message}</p>
              )}
            </Grid>

            {index !== 0 && (
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-around" }}>
                <Button
                  variant="outlined"
                  onClick={() => remove(index)}
                  className="mr-auto"
                >
                  Remover
                </Button>
              </Grid>
            )}
          </Grid>
        );
      })}
      <Grid item xs={12} sx={{ mt: 3, mb: 1, display: "flex", justifyContent: "space-around" }}>
        <Button
          onClick={() => append({ nome: "", telefone: [""], email: "", tipoDocumento: "RG", documento: "", parentesco: "" })}
          variant="contained"
        >
          Adicionar Residente
        </Button>
      </Grid>
    </>
  );
};
