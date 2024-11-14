import { Box, Stack } from "@mui/material";

export default function SocialMediaCardContainer({ children }) {
  return (
    <Box component="section" sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 2 }}
      >
        {children}
      </Stack>
    </Box>
  );
}
