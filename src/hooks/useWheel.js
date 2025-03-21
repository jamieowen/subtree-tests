export const useWheel = () => {
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const updateScroll = (evt) => {
      setScrolled(scrolled + evt.deltaY);
    };
    window.addEventListener('wheel', updateScroll);

    return () => {
      window.removeEventListener('wheel', updateScroll);
    };
  });

  return scrolled;
};
