import { HandleFunction } from "../../types";
import { handle } from "../handle";
import { IDENTIFIERS } from "../identifiers";
import { remove } from "../remove";


export const onSetScreenVisible = (cb: HandleFunction<boolean>) => {

	const setListener = (evt: CustomEvent<{ screenVisible: boolean }>) => {
		cb(evt.detail.screenVisible);
	};

	handle({
		eventId: IDENTIFIERS.SCREEN_VISIBLE,
		callback: setListener
	});

	return () => {
		remove({
			eventId: IDENTIFIERS.SCREEN_VISIBLE,
			handler: setListener
		});
	}
};