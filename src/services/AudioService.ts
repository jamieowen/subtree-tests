// import createAudioContext from 'ios-safe-audio-context'
import * as Tone from "tone";

class AudioService {
	started = false;
	players = [];
	rawContext;
	context;
	vol;

	constructor() {
		// this.rawContext = createAudioContext()
		this.context = new Tone.Context({
			// context: this.rawContext,
			latencyHint: "playback",
		});
		Tone.setContext(this.context);

		this.vol = new Tone.Volume(0).toDestination();

		document.addEventListener(
			"visibilitychange",
			this.onVisibilityChange,
			false,
		);
		// document.addEventListener("click", this.start, false)
	}

	start = async (opts = { forced: false }) => {
		console.log("AudioService.start");
		if (this.started && !opts.forced) {
			return;
		}
		this.started = true;
		// document.removeEventListener("click", this.start, false)
		await Tone.start();
	};

	getContext = () => {
		return this.context.rawContext;
	};

	addPlayer = (player) => {
		this.players.push(player);
	};

	mute = () => {
		// for (let player of this.players) {
		//   player.mute = true
		// }
		this.vol.volume.value = -100;
	};

	unmute = () => {
		// for (let player of this.players) {
		//   player.mute = false
		// }
		this.vol.volume.value = 0;
	};

	volume = (val) => {};

	stopAll = () => {
		for (const player of this.players) {
			player.stop();
		}
	};

	onVisibilityChange = () => {
		if (document.hidden) {
			this.mute();
		} else {
			this.unmute();
		}
	};
}

const service = new AudioService();
window.AudioService = service;
export default service;
