import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./SpeechToTextInput.css";
import MicVolumeIndicator from "./MicVolumeIndicator";

const locales = require("../config/locales.json");

const SpeechToTextInput = ({
  t,
  lang = "en",
  dir,
  onSendData,
  onIsLoading,
  onIsShowingResultCards,
}) => {
  const [inputText, setInputText] = useState(null);
  const [outputText, setOutputText] = useState(null);
  const [isAcceptInput, setIsAcceptInput] = useState(true);
  const [isShowMic, setIsShowMic] = useState(true);
  const [isShowSubmit, setIsShowSubmit] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const toggleListening = () => {
    setIsListening((prev) => !prev);
  };
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [locale, setLocale] = useState("AE"); // 'AE' = UAE, 'SA' = KSA, 'EG' = Egypt
  const handleLocaleChange = (event) => {
    setLocale(event.target.value);
  };

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
    const tempLocale = `${lang}-${lang === "en" ? "US" : locale}`;
    console.log("sending audio with locale:", tempLocale);

    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      setIsAcceptInput(false);
      setIsLoadingTranscript(true);
      const response = await axios.post(
        "http://localhost:3030/api/transcribe",
        formData,
        {
          params: {
            lang: tempLocale,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      if (!data.transcription) throw new Error("Empty response");
      setInputText(data.transcription);
      setOutputText(data.transcription);
    } catch (error) {
      console.error("Error transcribing audio:", error.message);
      setIsAcceptInput(true);
      setIsLoadingTranscript(false);
    } finally {
      setIsLoadingTranscript(false);
      setIsShowMic(false); //if success
      setIsShowSubmit(true);
    }
  };

  const submitInput = async () => {
    // return;
    // setisShowingResultCards(true);
    // setisAwaitOptimizedResult(true);
    if (!inputText) return;
    onIsShowingResultCards(true);
    onIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3030/api/optimize",
        {
          content: inputText,
        },
        { params: { lang: lang } }
      );
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

  const handleShowMic = () => {
    isShowMic ? setIsShowMic(false) : setIsShowMic(true);
    isShowMic ? setIsShowSubmit(true) : setIsShowSubmit(false);
  };

  return (
    <div className="input-container">
      {isLoadingTranscript && <CircularProgress size={"5em"} />}
      {isAcceptInput &&
        (isShowMic ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Tooltip
              title={isListening ? "Stop recording" : "Start recording"}
              placement="top"
            >
              <IconButton
                onClick={isListening ? stopListening : startListening}
                // onClick={toggleListening}
              >
                <MicVolumeIndicator isListening={isListening}>
                  <MicIcon
                    sx={{
                      color: !isListening && "#0550f0",
                      fontSize: 200,
                    }}
                  />
                </MicVolumeIndicator>
              </IconButton>
            </Tooltip>

            {lang === "ar" && (
              <FormControl variant="filled" sx={{ bgcolor: "white" }}>
                <InputLabel
                  id="country-select-label"
                  sx={{ direction: "rtl", textAlign: "right" }}
                >
                  الموقع
                </InputLabel>
                <Select
                  labelId="country-select-label"
                  id="country-select"
                  value={locale}
                  dir="rtl"
                  sx={{ textAlign: "right" }}
                  onChange={handleLocaleChange}
                >
                  {locales.ar.map((e) => (
                    <MenuItem dir="rtl" key={e.abbr} value={e.abbr}>
                      {e.icon} {e.nameAR}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
        ) : (
          <TextField
            id="input-text"
            placeholder={t("Enter text here")}
            multiline
            rows={10}
            value={inputText ? inputText : ""}
            required
            fullWidth
            onChange={(e) => setInputText(e.target.value)}
            sx={{
              bgcolor: "white",
              direction: dir,
            }}
          />
        ))}
      {isAcceptInput && (
        <Button
          size="small"
          disabled={isListening || isLoadingTranscript}
          onClick={handleShowMic}
          sx={{ color: "#3E4DA1" }}
        >
          <p style={{ fontSize: "1.2em" }}>
            {isShowMic ? t("or type it instead") : t("or record it instead")}
          </p>
        </Button>
      )}

      {outputText && (
        <div style={{ width: "100%" }}>
          <Typography variant="h4">{t("What we heard")}</Typography>
          <TextField
            id="output-text"
            placeholder={t("What we heard")}
            multiline
            rows={10}
            value={inputText}
            required
            fullWidth
            onChange={(e) => setInputText(e.target.value)}
            sx={{ bgcolor: "white", direction: dir }}
          />
          <Button
            size="small"
            disabled={isListening || isLoadingTranscript}
            onClick={handleShowMic}
            sx={{ color: "#3E4DA1" }}
          >
            {isShowMic ? t("or type it instead") : t("or record it instead")}
          </Button>
        </div>
      )}
      {isShowSubmit && (
        <Button
          variant="contained"
          dir={dir}
          onClick={submitInput}
          sx={{ width: "8em" }}
        >
          <p style={{ fontSize: "1.5em" }}>{t("Lets go!")}</p>
        </Button>
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
