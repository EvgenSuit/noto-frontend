import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

export const CommonAppBar = ({buttonText, onButtonClick}: {
    buttonText: string,
    onButtonClick: () => void
}) => {
    const navigate = useNavigate()
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5" 
                        sx={{ cursor: 'pointer' }}
                            align="left"
                        onClick={() => navigate('/')}>
                        Noto
                    </Typography>
                    {buttonText && <Button color="inherit" onClick={onButtonClick}>{buttonText}</Button>}
                </Toolbar>
            </AppBar>
            <Toolbar />
        </Box>
    )
}