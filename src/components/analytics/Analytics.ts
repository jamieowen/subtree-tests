const EXPERIENCE_NAME = 'Coca-Cola 2025 ESG Games';

const sendOneXPMessage = (
  eventName: string,
  params: Record<string, string | number>
) => {
  window.parent.postMessage(
    JSON.stringify({
      event: 'sendFirebaseEvent',
      name: eventName,
      params: params,
    }),
    '*'
  );
};

export const sendMessage = (
  eventName: string,
  params: Record<string, string | number>
) => {
  sendOneXPMessage(eventName, params);
};

export const screenViewEvent = (params?: Record<string, string | number>) =>
  sendMessage('virtual_pageview', {
    experience: EXPERIENCE_NAME,
    action: 'view_screen',
    ...params,
  });

export const userActionEvent = (params?: Record<string, string | number>) =>
  sendMessage('user_action', {
    experience: EXPERIENCE_NAME,
    ...params,
  });

// Start Experience Event
// export const recordStartExperienceEvent = () => sendMessage("start_experience", {
//     experience: EXPERIENCE_NAME,
//     action: 'start_experience',
//     screen: "landing_page",
//     round: ""
// })

// // Screen View Events
// export const recordLoadingScreenView = (roundNumber: number) => screenViewEvent({
//     screen: 'loading_screen',
//     round: getWorldName(roundNumber)
// })

// export const recordLandingPageView = (round: string = '') => screenViewEvent({
//     screen: 'landing_page',
//     round
// })

// export const recordPortalIntroPageView = (roundNumber?: number) => screenViewEvent({
//     screen: 'portal_intro_page',
//     round: (roundNumber) !== undefined ? getWorldName(roundNumber) : ''
// })

// export const recordPortalPageView = () => screenViewEvent({
//     screen: 'portal_page',
//     round: ''
// })

// export const recordCanScannerPageView = (roundNumber: number) => screenViewEvent({
//     screen: 'can_scanner_page',
//     round: getWorldName(roundNumber)
// })

// export const recordMusicPageView = () => screenViewEvent({
//     screen: 'music_page',
//     round: 'music_world'
// })

// export const recordCreateMusicPageView = () => screenViewEvent({
//     screen: 'create_music_page',
//     round: 'music_world'
// })

// export const recordLoadingRecordPageView = (round: string = '') => screenViewEvent({
//     screen: 'loading_record_page',
//     round
// })

// export const recordCompleteGamePageView = (roundNumber: number) => screenViewEvent({
//     screen: 'complete_game_page',
//     round: getWorldName(roundNumber)
// })

// export const recordCompleteWorldPageView = (roundNumber: number) => screenViewEvent({
//     screen: 'complete_world_page',
//     round: getWorldName(roundNumber)
// })

// export const recordClaimRewardPageView = (round: string = '') => screenViewEvent({
//     screen: 'claim_reward_page',
//     round
// })

// export const recordCluePageView = () => screenViewEvent({
//     screen: 'clue_page',
//     round: 'secret_world'
// })

// export const recordArtistPageView = () => screenViewEvent({
//     screen: 'artist_page',
//     round: 'artist_world'
// })

// // User Interaction Events
// export const recordEnterPortal = (roundNumber: number) => userActionEvent({
//     action: 'start_game',
//     screen: 'portal_game',
//     round: getWorldName(roundNumber)
// })

// export const recordScanCan = (roundNumber: number) => userActionEvent({
//     action: 'scan_can',
//     screen: 'can_scanner_page',
//     round: getWorldName(roundNumber)
// })

// export const recordCreateMusic = () => userActionEvent({
//     action: 'create_music',
//     screen: 'music_page',
//     round: 'music_world'
// })

// export const recordMixMusic = () => userActionEvent({
//     action: 'mix_music',
//     screen: 'create_music_page',
//     round: 'music_world'
// })

// export const recordRecordMusic = () => userActionEvent({
//     action: 'record_music',
//     screen: 'create_music_page',
//     round: 'music_world'
// })

// export const recordReRecordMusic = () => userActionEvent({
//     action: 're-record_music',
//     screen: 'create_music_page',
//     round: 'music_world'
// })

// export const recordStopRecording = () => userActionEvent({
//     action: 'stop_recording',
//     screen: 'create_music_page',
//     round: 'music_world'
// })

// export const recordShareRecord = () => userActionEvent({
//     action: 'share_record',
//     screen: 'create_music_page',
//     round: 'music_world'
// })

// export const recordQuitGame = (screen: string = '', roundNumber: number) => userActionEvent({
//     action: 'quit_game',
//     screen,
//     round: getWorldName(roundNumber)
// })

// export const recordClaimReward = (screen: string = '', roundNumber: number) => userActionEvent({
//     action: 'claim_reward',
//     screen,
//     round: getWorldName(roundNumber)
// })

// export const recordCopyCode = (roundNumber: number) => userActionEvent({
//     action: 'copy_code',
//     screen: 'complete_world_page',
//     round: getWorldName(roundNumber)
// })

// export const recordDownloadApp = (roundNumber: number) => userActionEvent({
//     action: 'download_app',
//     screen: 'complete_world_page',
//     round: getWorldName(roundNumber)
// })

// export const recordExploreGames = (roundNumber: number) => userActionEvent({
//     action: 'explore_games',
//     screen: 'complete_game_page',
//     round: getWorldName(roundNumber)
// })

// export const recordRevealClue = () => userActionEvent({
//     action: 'reveal_clue',
//     screen: 'clue_page',
//     round: 'secret_world'
// })

// export const recordOpenArtistCard = (artist: string = '') => userActionEvent({
//     action: 'open_card',
//     screen: 'artist_page',
//     round: 'artist_world',
//     artist
// })

// export const recordCloseArtistCard = (artist: string = '') => userActionEvent({
//     action: 'close_card',
//     screen: 'artist_page',
//     round: 'artist_world',
//     artist
// })

// export const recordSharePlaylist = (artist: string = '') => userActionEvent({
//     action: 'share_playlist',
//     screen: 'artist_page',
//     round: 'artist_world',
//     artist
// })

// export const recordSpotifyInteraction = (artist: string = '') => userActionEvent({
//     action: 'card_interaction',
//     screen: 'artist_page',
//     round: 'artist_world',
//     artist
// })
