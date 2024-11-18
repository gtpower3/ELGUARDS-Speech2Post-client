import { Grid2 } from "@mui/material";

export default function SocialMediaCardContainer({ children }) {
  return (
    <Grid2 container spacing={1} justifyContent={"center"}>
      {children}
    </Grid2>
  );
}
