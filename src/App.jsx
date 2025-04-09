import { MittProvider } from '@/contexts/mitt';
import { getUrlBoolean } from '@/helpers/UrlParam';
import '@/plugins/day';
import '@/plugins/i18n';
import { ui } from '@/tunnels';
import { Leva } from 'leva';
import './App.sass';
import AssetService from '@/services/AssetService';

import { ColorManagement } from 'three';
ColorManagement.enabled = true;

export function App() {
  const { disable } = useContextMenu();
  disable();

  // useEffect(() => {
  //   window.AssetService = AssetService;
  // }, []);

  return (
    <div
      id="app"
      className="fixed top-0 left-0 w-full h-full"
    >
      <Leva hidden={!getUrlBoolean('leva')} />
      <MittProvider>
        <Webgl />

        <div className="ui">
          <Pages />
          <ui.Out />
          <TheHeader />
          <Loading />
          <TheGuidelines />
          <Quit />
        </div>
      </MittProvider>
    </div>
  );
}
