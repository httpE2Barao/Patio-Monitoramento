import { Box, Button } from "@mui/material"
import Image from "next/image"

export const BtnToTop = () => {
    return (
        <Button variant="contained" sx={{ display: "absolute", position: "fixed", width: "70px", height: "70px", right: 20, bottom: 30, cursor: "pointer", backgroundColor: "primary.main", borderRadius: "50%", p: 0 }}>
            <Image src={'/down.png'} alt="Voltar ao topo" width={75} height={75}
                className="rotate-180 -translate-y-1 "
                onClick={() => {
                    document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' });
                }}
            />
        </Button >
    )
}