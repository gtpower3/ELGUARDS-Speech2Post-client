import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, CardActions, Skeleton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faXTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";

export default function SocialMediaCard({
  title = "",
  content = "",
  isLoading = true,
  dir = "ltr",
  t,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [cardContent, setCardContent] = useState(content);
  function handleEditButton() {
    //if button set to DONE -> set to EDIT / else -> set to DONE
    if (isEditing) setIsEditing(false);
    else setIsEditing(true);
  }
  const setTitleIcon = () => {
    const tempTitle = title.toLowerCase();
    if (tempTitle.includes("facebook")) {
      return <FontAwesomeIcon icon={faFacebook} />;
    } else if (tempTitle.includes("twitter")) {
      return <FontAwesomeIcon icon={faXTwitter} />;
    } else if (tempTitle.includes("linkedin")) {
      return <FontAwesomeIcon icon={faLinkedin} />;
    } else if (tempTitle.includes("instagram")) {
      return <FontAwesomeIcon icon={faInstagram} />;
    } else return <FontAwesomeIcon icon={faUserGroup} />;
  };
  // Sync cardContent state with the content prop when it changes
  useEffect(() => {
    setCardContent(content);
  }, [content]);
  return (
    <Card
      variant="elevation"
      sx={{
        width: "22em",
        height: "25em",
        display: "flex",
        flexDirection: "column",
        direction: dir,
        textAlign: dir === "rtl" ? "right" : "left",
      }}
    >
      <CardContent sx={{ height: "70%" }}>
        {setTitleIcon()}
        <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
          {isLoading ? <Skeleton width="60%" /> : title}
        </Typography>
        {isEditing ? (
          <TextField
            id={title}
            defaultValue={cardContent}
            multiline
            rows={10}
            sx={{ width: "100%" }}
            onChange={(e) => setCardContent(e.target.value)}
          />
        ) : (
          <Typography
            variant="body2"
            component="p"
            overflow={"auto"}
            height={"100%"}
            dir="rtl"
            sx={{ color: "text.secondary" }}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" height={150} />
            ) : (
              cardContent
            )}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ alignSelf: "flex-end", marginTop: "auto" }}>
        <Button
          size="small"
          disabled={isLoading ? true : false}
          onClick={handleEditButton}
        >
          {isLoading ? (
            <Skeleton width={"100%"} />
          ) : isEditing ? (
            t("Done")
          ) : (
            t("Edit")
          )}
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={isLoading || isEditing ? true : false}
        >
          {isLoading ? <Skeleton width={"100%"} /> : t("Post")}
        </Button>
      </CardActions>
    </Card>
  );
}
