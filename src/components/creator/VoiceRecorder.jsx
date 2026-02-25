import React, { useState, useRef } from "react";
import { Mic, Square, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function VoiceRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        if (onRecordingComplete) {
          onRecordingComplete(url);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const deleteRecording = () => {
    setAudioURL(null);
    setDuration(0);
    if (onRecordingComplete) {
      onRecordingComplete(null);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {!audioURL ? (
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-[#242424] border-2 border-dashed border-[#333]">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="w-20 h-20 rounded-full gradient-red"
            >
              <Mic className="w-8 h-8" />
            </Button>
          ) : (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center"
              >
                <Mic className="w-8 h-8 text-white" />
              </motion.div>
              <p className="text-2xl font-mono text-white">{formatTime(duration)}</p>
              <Button
                onClick={stopRecording}
                variant="outline"
                className="border-[#333] text-white"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            </>
          )}
          {!isRecording && (
            <p className="text-sm text-gray-500 text-center">
              Tap to record your voice story
            </p>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#242424] border border-[#333] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2A5C3E]/15 flex items-center justify-center">
                <Play className="w-5 h-5 text-[#2A5C3E]" />
              </div>
              <div>
                <p className="text-white font-medium">Voice Story Recorded</p>
                <p className="text-sm text-gray-500">{formatTime(duration)}</p>
              </div>
            </div>
            <Button
              onClick={deleteRecording}
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
          <audio src={audioURL} controls className="w-full" />
        </div>
      )}
    </div>
  );
}