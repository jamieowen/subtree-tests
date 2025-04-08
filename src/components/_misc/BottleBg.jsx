import IconPattern from '@/assets/bottle-pattern.svg?react';
import './BottleBg.sass';

export const BottleBg = () => {
  return (
    <div className="bottleBg">
      <div className="bottleBg__pattern">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="contents"
          >
            <IconPattern className="bottle red" />
            <IconPattern className="bottle green" />
          </div>
        ))}
      </div>
      <div className="bottleBg__circle" />
    </div>
  );
};
