import { Grid, Typography } from "@mui/material";

export const Titulo = (props: { titulo: string }) => {
    return (
        <Grid item xs={12}>
            <Typography sx={{
                fontSize: {
                    xs: "2rem",
                    sm: "2.4rem",
                    md: "2.4rem",
                    lg: "2.4rem",
                    xl: "2.4rem",
                },
                fontWeight: 500,
                textAlign: "left",
                color: "black",
                py: "1vw",
            }}>
                {props.titulo}
            </Typography>
        </Grid>
    );
};