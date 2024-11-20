import React, { useEffect, useRef, useState } from "react";
import "./MicVolumeIndicator.css";

const MicVolumeIndicator = ({ isListening, children }) => {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    if (isListening) {
      startMicStream();
    } else {
      stopMicStream();
    }

    return () => stopMicStream();
  }, [isListening]);

  const startMicStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      sourceRef.current.connect(analyserRef.current);

      monitorVolume();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopMicStream = () => {
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      // Check if the AudioContext is in a state that can be closed
      if (audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }
    setVolume(0);
  };

  const monitorVolume = () => {
    const updateVolume = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const maxVolume = Math.max(...dataArrayRef.current);
        setVolume(maxVolume / 255); // Normalize to a 0-1 range
      }
      requestAnimationFrame(updateVolume);
    };
    updateVolume();
  };

  return (
    <div
      style={{
        color: `rgba(0, 255, 0, ${volume})`, // Adjust opacity based on volume
        transition: "background-color 0.1s ease-in-out",
      }}
    >
      {children}
    </div>
  );
};

export default MicVolumeIndicator;
