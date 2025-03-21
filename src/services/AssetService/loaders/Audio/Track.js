import EventEmitter from "@/helpers/EventEmitter";

const Events = {
	LOAD: "load",
	END: "end",
	PLAY: "play",
	PAUSE: "pause",
	STATE: "state",
};

export default class Track {
	constructor() {
		Object.assign(this, EventEmitter, {
			Events,
		});
	}

	bindEvents = () => {
		for (const key in this.Events) {
			const ev = this.Events[key];
			if (
				(window.Howler && typeof this.obj[`_on${ev}`] === "object") || // howler
				!window.Howler // everything else
			) {
				this.obj.on(ev, (s) => {
					this.emit(ev, s);
				});
			}
		}
	};
}
