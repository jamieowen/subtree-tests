import AssetService from '@/services/AssetService';
import { manifests } from '@/config/assets';
import { useLoadingStore } from '@/stores/loading';

export const useAssetManifest = (manifestId) => {
  const manifest = useMemo(() => {
    return manifests[manifestId];
  }, [manifestId]);

  // Add group
  const addLoadGroup = useLoadingStore((state) => state.addLoadGroup);
  addLoadGroup(manifestId);

  // Update group progress
  const setLoadGroupProgress = useLoadingStore(
    (state) => state.setLoadGroupProgress
  );
  AssetService.subscribeManifestProgress(manifestId, (evt) => {
    setLoadGroupProgress(manifestId, evt.progress);
  });

  // Update group completed
  const setLoadGroupCompleted = useLoadingStore(
    (state) => state.setLoadGroupCompleted
  );
  AssetService.subscribeManifestLoaded(manifestId, () => {
    // setLoadGroupProgress(manifestId, 1);
    setLoadGroupCompleted(manifestId);
  });

  // Load it
  return suspend(async () => {
    let results = await AssetService.loadManifest(manifest);
    // setLoadGroupProgress(manifestId, 1);
    // setLoadGroupCompleted(manifestId);
    return results;
  }, [`manifest-${manifestId}`]);
};
