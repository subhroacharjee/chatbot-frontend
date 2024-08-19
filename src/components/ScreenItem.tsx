import { Grid, Paper, Box, Container } from "@mui/material";
import { PropsWithChildren } from "react";

type ScreenItemProp = { fullscreen?: boolean } & PropsWithChildren;

export const ScreenItem = ({ children, fullscreen }: ScreenItemProp) => {
  return (
    <Grid item xs={12} sm={fullscreen ? 11 : 8} md={fullscreen ? 11 : 6} lg={fullscreen ? 11 : 4} component={Paper} elevation={fullscreen ? 0 : 1} minHeight={fullscreen ? '100%' : undefined}>
      <Box display={'flex'} flexDirection='column' alignItems={'stretch'} padding={1} paddingX={2}>
        {children}
      </Box>
    </Grid>
  )
}
