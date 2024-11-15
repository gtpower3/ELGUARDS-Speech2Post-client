import { Button, TextField } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import React, { useState, useRef } from "react";
import axios from "axios";
import "./SpeechToTextInput.css";

const SpeechToTextInput = ({ onDataFromChild }) => {
  const [inputText, setInputText] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [isListening, setIsListening] = useState(false);
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
      const response = await fetch("http://192.168.1.41:3030/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setTranscribedText(data.transcription);
      setInputText(data.transcription);
    } catch (error) {
      console.error("Error transcribing audio", error);
    }
  };

  const submitInput = async () => {
    // return;
    // setisShowingResultCards(true);
    // setisAwaitOptimizedResult(true);
    try {
      const res = await axios.post("http://192.168.1.41:3030/api/optimize", {
        content: inputText,
      });
      console.log(res.status === 200 ? "Success!" : "Failed");
      const resObj = res.data;
      onDataFromChild(resObj);
      console.log(resObj);
    } catch (error) {
      console.error(error);
    } finally {
      // setisAwaitOptimizedResult(false); // Stop loading indicator
    }
  };

  const sendDataToParent = () => {
    onDataFromChild(inputText);
  };

  return (
    <div className="input-container" style={{ width: "100%" }}>
      <TextField
        id="prompt-input"
        label="TESTING - Enter prompt here"
        multiline
        rows={10}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        sx={{ width: "100%", bgcolor: "white" }}
      />
      <div className="input-container-button-group">
        {/* <Button variant="contained" >:</Button> */}
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
        <Button variant="contained" onClick={submitInput}>
          Submit
        </Button>
      </div>

      {/* <div>
        <h2>Transcribed Text:</h2>
        <p>{transcribedText}</p>
      </div> */}
    </div>
  );
};

export default SpeechToTextInput;
