import IconSoundOn from '@/assets/sound-on.svg?react';
import IconSoundOff from '@/assets/sound-off.svg?react';
import { useAppStore } from '@/stores/app';

export const ButtonMute = () => {
  const muted = useAppStore((state) => state.muted);
  const toggleMuted = useAppStore((state) => state.toggleMuted);

  return (
    <button
      className="btn-audio"
      onClick={() => toggleMuted()}
    >
      {!muted && <IconSoundOn />}
      {muted && <IconSoundOff />}
    </button>
  );
};
