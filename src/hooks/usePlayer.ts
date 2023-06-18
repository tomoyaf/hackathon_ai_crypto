import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { Music } from "@prisma/client";
import { useEffect } from "react";
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

export const usePlayerInit = () => {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const setCurrentMusic = useSetRecoilState(currentMusicAtom);
  const audio = useRecoilValue(audioAtom);

  useEffect(() => {
    if (isPlaying) {
      audio?.play();
    } else {
      audio?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setCurrentMusic(null);
        setIsPlaying(false);
      }
    };
  }, []);
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  usePlayerInit();

  return children;
};

export const usePlayer = () => {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const [currentMusic, setCurrentMusic] = useRecoilState(currentMusicAtom);
  const [audio, setAudio] = useRecoilState(audioAtom);

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
