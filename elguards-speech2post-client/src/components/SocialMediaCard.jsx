import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, CardActions, Skeleton, TextField } from "@mui/material";

export default function SocialMediaCard({
  title = "",
  content = "",
  isLoading = true,
}) {
  return (
    <Card
      variant="elevation"
      sx={{
        width: "25em",
        height: "25em",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
          {isLoading ? <Skeleton /> : title}
        </Typography>
        <TextField
          id="prompt-input"
          label="TESTING - Enter prompt here"
          multiline
          rows={{ xs: 1, sm: 2, md: 4 }}
          sx={{ width: "100%" }}
        />
        <Typography
          variant="body2"
          component="p"
          sx={{ color: "text.secondary" }}
        >
          {isLoading ? <Skeleton /> : content}
        </Typography>
      </CardContent>
      <CardActions sx={{ alignSelf: "flex-end", marginTop: "auto" }}>
        <Button size="small" disabled={isLoading ? true : false}>
          {isLoading ? <Skeleton width={"100%"} /> : "Edit"}
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={isLoading ? true : false}
        >
          {isLoading ? <Skeleton width={"100%"} /> : "Post"}
        </Button>
      </CardActions>
    </Card>
  );
}
