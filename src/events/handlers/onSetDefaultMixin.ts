import { HandleFunction } from "../../types";
import { handle } from "../handle";
import { IDENTIFIERS } from "../identifiers";
import { remove } from "../remove";


export const onSetDefaultMixin = (cb: HandleFunction<number>) => {

	const setMixinListener = (evt: CustomEvent<{ defaultMixins: number }>) => {
		cb(evt.detail.defaultMixins);
	};

	handle({
		eventId: IDENTIFIERS.SET_DEFAULT_MIXIN,
		callback: setMixinListener
	});

	return () => {
		remove({
			eventId: IDENTIFIERS.SET_DEFAULT_MIXIN,
			handler: setMixinListener
		});
	}
};