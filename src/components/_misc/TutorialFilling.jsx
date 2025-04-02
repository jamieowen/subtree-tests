import './TutorialFilling.sass';

export const TutorialFilling = () => {
  return (
    <div className="tutorial-filling">
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
    </div>
  );
};
