import AssetService from '@/services/AssetService';
import { manifests } from '@/config/assets';
import { useLoadingStore } from '@/stores/loading';

const ignoreKeys = [
  'addLoadGroup',
  'setLoadGroupProgress',
  'setLoadGroupCompleted',
];

// Pass in null to get total progress of all manifests added together
export const useAssetProgress = (manifestId) => {
  const store = useLoadingStore();

  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const update = function (evt) {
    // Update progress based on manifestId
    if (manifestId) {
      let item = evt[manifestId];
      if (!item) return;
      setProgress(item.progress);
      setCompleted(item.completed);
      return;
    }

    // Update progress based on all manifests
    let totalProgress = 0;
    let totalCompleted = true;

    let groups = Object.keys(evt).filter((key) => ignoreKeys.indexOf(key) < 0);
    let numGroups = groups.length;

    for (let group of groups) {
      totalProgress += evt[group].progress;
      totalCompleted = totalCompleted && evt[group].completed;
      setProgress(totalProgress / numGroups);
      setCompleted(totalCompleted);
    }

    // console.log(
    //   'useAssetProgress.update',
    //   groups,
    //   numGroups,
    //   totalProgress,
    //   totalCompleted
    // );
  };

  useEffect(() => {
    update(store);
    return useLoadingStore.subscribe(update);
  }, []);

  return {
    completed,
    progress,
  };
};
