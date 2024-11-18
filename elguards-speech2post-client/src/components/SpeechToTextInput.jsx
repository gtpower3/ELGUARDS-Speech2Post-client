import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import React, { useState, useRef } from "react";
import axios from "axios";
import "./SpeechToTextInput.css";

const SpeechToTextInput = ({
  onSendData,
  onIsLoading,
  onIsShowingResultCards,
}) => {
  const [inputText, setInputText] = useState(null);
  const [isAcceptInput, setIsAcceptInput] = useState(true);
  const [isShowMic, setIsShowMic] = useState(true);
  const [isShowSubmit, setIsShowSubmit] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Function to start recording audio
  const startListening = async () => {
    setIsListening(true);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        // Save the original recording to check if it has audio
        // const originalAudioUrl = URL.createObjectURL(audioBlob);
        // const originalAudio = document.createElement("audio");
        // originalAudio.src = originalAudioUrl;
        // originalAudio.controls = true;
        // document.body.appendChild(originalAudio);
        await sendAudioToBackend(audioBlob);
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing the microphone", error);
    }
  };

  // Function to stop recording
  const stopListening = () => {
    setIsListening(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // Function to send audio blob to backend
  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      setIsAcceptInput(false);
      setIsLoadingTranscript(true);
      const response = await fetch("http://localhost:3030/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setInputText(data.transcription);
    } catch (error) {
      console.error("Error transcribing audio", error);
    } finally {
      setIsLoadingTranscript(false);
      setInputText("what we heard");
      setIsShowMic(false); //if success
    }
  };

  const submitInput = async () => {
    // return;
    // setisShowingResultCards(true);
    // setisAwaitOptimizedResult(true);
    try {
      const res = await axios.post("http://localhost:3030/api/optimize", {
        content: inputText,
      });
      console.log(res.status === 200 ? "Success!" : "Failed");
      const resObj = res.data;
      onSendData(resObj);
      // console.log(resObj);
    } catch (error) {
      console.error(error);
    } finally {
      // setisAwaitOptimizedResult(false); // Stop loading indicator
    }
  };

  const handleShowMic = () => {
    isShowMic ? setIsShowMic(false) : setIsShowMic(true);
    isShowMic ? setIsShowSubmit(true) : setIsShowSubmit(false);
  };

  return (
    <div className="input-container">
      {isLoadingTranscript && <CircularProgress size={"5em"} />}
      {isAcceptInput &&
        (isShowMic ? (
          <Tooltip
            title={isListening ? "Stop recording" : "Start recording"}
            placement="top"
          >
            <IconButton onClick={isListening ? stopListening : startListening}>
              <MicIcon
                sx={{
                  color: isListening ? "red" : "#0550f0",
                  fontSize: 200,
                }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <TextField
            id="input-text"
            label="Enter text here"
            multiline
            rows={10}
            value={inputText}
            required
            onChange={(e) => setInputText(e.target.value)}
            sx={{ width: "100%", bgcolor: "white" }}
          />
        ))}
      {isAcceptInput && (
        <Button
          size="small"
          disabled={isListening || isLoadingTranscript}
          onClick={handleShowMic}
          sx={{ color: "#3E4DA1" }}
        >
          {isShowMic ? "or type it instead" : "or record it instead"}
        </Button>
      )}
      {isShowSubmit && (
        <Button variant="contained" onClick={submitInput}>
          Submit
        </Button>
      )}
      {inputText && (
        <div style={{ width: "100%" }}>
          <Typography variant="h4">What we heard</Typography>
          <TextField
            id="input-text"
            label="Enter text here"
            multiline
            rows={10}
            value={inputText}
            required
            onChange={(e) => setInputText(e.target.value)}
            sx={{ width: "100%", bgcolor: "white" }}
          />
        </div>
      )}

      {/* <div className="input-container-button-group">
        <Button
          variant="contained"
          onClick={isListening ? stopListening : startListening}
          sx={{
            marginRight: ".4em",
            bgcolor: isListening ? "red" : "#AAA7D0",
          }}
        >
          <MicIcon color="secondary" />
        </Button>
        
      </div> */}

      {/* <div>
        <h2>Transcribed Text:</h2>
        <p>{transcribedText}</p>
      </div> */}
    </div>
  );
};

export default SpeechToTextInput;