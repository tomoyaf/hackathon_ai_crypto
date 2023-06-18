import { atom } from "recoil";
import { Music } from "@prisma/client";
import { useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";

export const isPlayingAtom = atom<boolean>({
  key: "isPlaying",
  default: false,
});

export const currentMusicAtom = atom<Music | null>({
  key: "currentMusic",
  default: null,
});

export const audioAtom = atom<HTMLAudioElement | null>({
  key: "audio",
  default: null,
});

export const usePlayer = () => {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const [currentMusic, setCurrentMusic] = useRecoilState(currentMusicAtom);
  const [audio, setAudio] = useRecoilState(audioAtom);

  useEffect(() => {
    if (isPlaying) {
      audio?.play();
    } else {
      audio?.pause();
    }
  }, [isPlaying]);

  const playMusic = async (music: Music) => {
    if (audio) {
      if (currentMusic?.id === music.id) {
        audio.play();
      } else {
        audio.pause();
        const newAudio = new Audio(music.url);
        newAudio.play();
        setAudio(newAudio);
        setCurrentMusic(music);
      }
      setIsPlaying(true);
    } else {
      const newAudio = new Audio(music.url);
      newAudio.play();
      setAudio(newAudio);
      setCurrentMusic(music);
      setIsPlaying(true);
    }
  };

  const stopMusic = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setCurrentMusic(null);
      setIsPlaying(false);
    }
  };

  const isMusicPlaying = (music: Music) => {
    return isPlaying && currentMusic?.id === music.id;
  };

  const handlePlayButtonClick = (music: Music) => {
    if (isMusicPlaying(music)) {
      stopMusic();
    } else {
      playMusic(music);
    }
  };

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  return {
    isPlaying,
    currentMusic,
    playMusic,
    stopMusic,
    isMusicPlaying,
    handlePlayButtonClick,
    audioRef: { current: audio },
  };
};
