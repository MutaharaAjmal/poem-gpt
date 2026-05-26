// hooks/useAudioController.ts
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";

export const useAudioController = () => {
  const [isMuted, setIsMuted] = useState(false);
  const player = useAudioPlayer(require("@/assets/audio/bg_music.mp3"));

  player.loop = true;
  player.volume = 0.2;

  const toggleMusic = () => {
    if (player.playing) {
      player.pause();
      setIsMuted(true);
    } else {
      player.play();
      setIsMuted(false);
    }
  };

  return { isMuted, toggleMusic, player };
};
