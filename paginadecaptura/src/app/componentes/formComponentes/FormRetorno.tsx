import { Container, Typography } from "@mui/material";
import { retornoForm } from "./construtor";

export const FormRetorno = () => {
    return (
        <Container sx={{ textAlign: 'center', }}>
            {retornoForm == true ? (
                <Typography sx={{ fontSize: '1.7rem', fontWeight: '500' }}>
                    Dados enviado com sucesso!
                </Typography>
            ) : retornoForm == false ? (
                <Typography sx={{ fontSize: '1.7rem', fontWeight: '500' }}>
                    Erro ao enviar as informações!
                </Typography>
            ) : (
                <></>
            )}
        </Container>
    );
};