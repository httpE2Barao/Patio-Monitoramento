"use client"
import { Container, Typography } from "@mui/material";

export const FormRetorno = (props: { enviado: boolean|undefined }) => {
    
    return (
        <Container sx={{ textAlign: 'center' }}>
            {props.enviado === true ? (
                <Typography sx={{ fontSize: '1.7rem', fontWeight: '500' }}>
                    Dados enviados com sucesso!
                </Typography>
            ) : props.enviado === false ? (
                <Typography sx={{ fontSize: '1.7rem', fontWeight: '500' }}>
                    Erro ao enviar as informações!
                </Typography>
            ) : (
                <></>
            )}
        </Container>
    )
};


