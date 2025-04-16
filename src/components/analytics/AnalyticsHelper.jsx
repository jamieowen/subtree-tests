import * as Analytics from './Analytics';

export const AnalyticsHelper = () => {
  // ***************************************************************************
  //
  // PAGE & SECTION
  //
  // ***************************************************************************
  const page = useAppStore((state) => state.page);
  const cleaningSection = useCleaningStore((state) => state.section);
  const fillingSection = useFillingStore((state) => state.section);
  const groupingSection = useGroupingStore((state) => state.section);

  useEffect(() => {
    const section = {
      cleaning: cleaningSection,
      filling: fillingSection,
      grouping: groupingSection,
    }[page];

    const evt = {
      screen: page,
      section,
    };

    console.log('AnalyticsHelper', evt);

    Analytics.screenViewEvent(evt);
  }, [page, cleaningSection, fillingSection, groupingSection]);

  // ***************************************************************************
  //
  // RESIZE
  //
  // ***************************************************************************
  useEffect(() => {
    resizeWindow(window.innerHeight);
  }, []);

  useResize(() => {
    resizeWindow(window.innerHeight);
  });
};
