import './App.scss'
import './Fonts.scss'
import BypassPanel from './dev_tools/BypassPanel'
import AppRouter from './AppRouter'
import LandingPage from './landing_page/LandingPage';
import PortalSelection from './portal_selection/PortalSelection';
import { WorldUnlockProvider } from '../contexts/WorldUnlockContext'
import { AudioProvider } from '../contexts/AudioContext'
import AudioControl from './layout/AudioControl'
import DesktopModal from './desktop_modal/DesktopModal'
import { useEffect, useState } from 'react';
import GlobalPreloader from './global_preloader/GlobalPreloader';
import { LoadingScreenMini } from './loading_screen_mini/LoadingScreenMini';
import { resizeWindow } from '../utils/OneXP';

function App() {
  const [ showMuteButton, setShowMuteButton ] = useState( true )

  // Call OneXP resize utility to resize parent iframe.
  // Should only affect staging and prod environments
  useEffect(() => {
    const handleResize = () => {
      resizeWindow(window.innerHeight)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return (
    <>
      <GlobalPreloader>
        <AudioProvider>
          <AudioControl showMuteButton={showMuteButton}/>
          <BypassPanel/>
          <WorldUnlockProvider>
            <AppRouter>
              <LandingPage
                match="landing"
                setShowMuteButton={setShowMuteButton}
              />
              <PortalSelection match="portalSelection"/>
            </AppRouter>
          </WorldUnlockProvider>
        </AudioProvider>
        <DesktopModal/>
      </GlobalPreloader>
      <LoadingScreenMini />
    </>
  )
}

export default App
