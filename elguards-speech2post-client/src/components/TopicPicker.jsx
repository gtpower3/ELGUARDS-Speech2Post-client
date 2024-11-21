import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";
import "./TopicPicker.css";
import axios from "axios";
const topics = require("../config/topics.json");

const TopicPicker = ({ onSendData, onIsLoading }) => {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const handleTitleChange = (event) => {
    setSubTopic("");
    setTopic("");
    setTitle(event.target.value);
  };
  const handleTopicChange = (event) => {
    setSubTopic("");
    setTopic(event.target.value);
  };
  const handleSubTopicChange = (event) => {
    setSubTopic(event.target.value);
  };

  const submitInput = async () => {
    // return;
    // setisShowingResultCards(true);
    // setisAwaitOptimizedResult(true);
    onIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3030/api/optimize", {
        content: `Topic: ${title} - ${topic} - ${subTopic}`,
      });
      console.log(res.status === 200 ? "Success!" : "Failed");
      const resObj = res.data;
      onSendData(resObj);
      // console.log(resObj);
    } catch (error) {
      console.error(error);
    } finally {
      onIsLoading(false);
      // setisAwaitOptimizedResult(false); // Stop loading indicator
    }
  };
  return (
    <div className="TopicPicker">
      <div className="selects-container">
        <FormControl variant="filled" fullWidth sx={{ bgcolor: "white" }}>
          <InputLabel id="title-select-label">Title</InputLabel>
          <Select
            labelId="title-select-label"
            id="title-select"
            value={title}
            onChange={handleTitleChange}
          >
            {topics.data.map((e, i) => (
              <MenuItem key={i} value={e.title}>
                {e.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="filled" fullWidth sx={{ bgcolor: "white" }}>
          <InputLabel id="country-select-label">Topic</InputLabel>
          <Select
            labelId="topic-select-label"
            id="topic-select"
            value={topic}
            disabled={title === ""}
            onChange={handleTopicChange}
          >
            {topics.data
              .filter((e) => e.title === title)[0]
              ?.topics?.map((f, i) => (
                <MenuItem key={i} value={f.title}>
                  {f.title}
                </MenuItem>
              ))}

            {/* {topics.data[title]?.topics.map((e, i) => (
            <MenuItem key={i} value={e.title}>
              {e.title}
            </MenuItem>
          ))} */}
          </Select>
        </FormControl>
        <FormControl variant="filled" fullWidth sx={{ bgcolor: "white" }}>
          <InputLabel id="subtopic-select-label">Subtopic</InputLabel>
          <Select
            labelId="subtopic-select-label"
            id="subtopic-select"
            value={subTopic}
            disabled={topic === ""}
            onChange={handleSubTopicChange}
          >
            {topics.data
              .filter((e) => e.title === title)[0]
              ?.topics?.filter((f) => f.title === topic)[0]
              ?.subtopics?.map((g, i) => (
                <MenuItem key={i} value={g}>
                  {g}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
      <Button
        variant="contained"
        onClick={submitInput}
        disabled={subTopic === ""}
        sx={{ width: "8em", marginTop: "1em" }}
      >
        <p style={{ fontSize: "1.5em" }}>Lets go!</p>
      </Button>
    </div>
  );
};

export default TopicPicker;
