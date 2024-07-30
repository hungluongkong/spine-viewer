import { dispatch } from "../dispatch";
import { IDENTIFIERS } from "../identifiers";

export const screenVisibleChange = (screenVisible: boolean) => {
	dispatch({
		eventId: IDENTIFIERS.SCREEN_VISIBLE,
		detail: {
			screenVisible
		},
	});
};