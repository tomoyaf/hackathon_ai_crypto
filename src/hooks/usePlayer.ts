import { atom } from "recoil";
import { Music } from "@prisma/client";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

export const isPlayingAtom = atom<boolean>({
  key: "isPlaying",
  default: false,
});

export const currentMusicAtom = atom<Music | null>({
  key: "currentMusic",
  default: null,
});

export const usePlayer = () => {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const [currentMusic, setCurrentMusic] = useRecoilState(currentMusicAtom);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const playMusic = (music: Music) => {
    setCurrentMusic(music);
    setIsPlaying(true);
  };

  const stopMusic = () => {
    setCurrentMusic(null);
    setIsPlaying(false);
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
    audioRef,
  };
};
