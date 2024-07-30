import { dispatch } from "../dispatch";
import { IDENTIFIERS } from "../identifiers";

export const defaultMixinChange = (defaultMixins: number) => {
	dispatch({
		eventId: IDENTIFIERS.SET_DEFAULT_MIXIN,
		detail: {
			defaultMixins: defaultMixins
		},
	});
};