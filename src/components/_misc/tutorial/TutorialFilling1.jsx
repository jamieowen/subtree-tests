import './TutorialFilling1.sass';

export const TutorialFilling1 = () => {
  return (
    <div className="tutorial-filling1">
      <img
        src="/assets/images-next/filling-tutorial-outline.webp"
        className="bottle-outline"
      />

      <div className="bottle-solid-wrap">
        <img
          src="/assets/images-next/filling-tutorial-solid.webp"
          className="bottle-solid"
        />
      </div>

      <img
        src="/assets/images-next/filling-tutorial-line.svg"
        className="bottle-line"
      />
    </div>
  );
};
