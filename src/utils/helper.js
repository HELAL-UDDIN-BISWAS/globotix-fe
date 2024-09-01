import { PAGES } from "@/const/pages";
import ROLE from "@/const/role";
import { format, getDay, parse, parseISO } from "date-fns";

const RangeColor = (number) => {
	if (number === 0) return "#333333";
	else if (number > 0 && number < 40) return "#A70000";
	else if (number >= 40 && number < 75) return "#FCCC3B";
	else if (number >= 75) return "#0A8217";
};

const RangeColorStatus = (status) => {
	switch (status) {
		case "COMPLETE":
			return "#00B633";

		case "INCOMPLETE":
			return "#FF4D00";

		case "PARTIALLY COMPLETED":
			return "#00B633";

		case "FAILED":
			return "#FCCC3B";
	}
};

const getRandomInt = (max) => {
	return Math.floor(Math.random() * max);
};

const isOnlyAdmin = (arr) => {
	let admin = arr?.toLowerCase() === ROLE.ADMIN.toLowerCase();

	if (admin) return true;
	else return false;
};

const isUserRole = (arr) => {
	let user = arr?.toLowerCase() === ROLE.USER.toLowerCase();

	if (user) return true;
	else return false;
};

const isAdmin = (arr) => {
	let admin = arr?.toLowerCase() === ROLE.ADMIN.toLowerCase();
	let superadmin = arr?.toLowerCase() === ROLE.SUPERADMIN.toLowerCase();

	if (admin || superadmin) return true;
	else return false;
};

const isSuperAdmin = (arr) => {
	let superadmin = arr?.toLowerCase() === ROLE.SUPERADMIN.toLowerCase();
	if (superadmin) return true;
	else return false;
};

const permissionPageView = (page, role) => {
	let _page = PAGES.find((v) => v.NAME === page);
	let found = _page?.ACCESS.find(
		(v) => v.toLowerCase() === role?.toLowerCase()
	);
	if (found !== undefined) {
		return true;
	} else {
		return false;
	}
};

const formatIsoDate = (date) => {
	if (!date) return "";
	return new Date(date.slice(0, -1));
};

const getDayOfWeek = (date) => {
	const ISODate = parseISO(date);
	const dayOfWeekIndex = getDay(ISODate);
	const dayOfWeekString = format(dayOfWeekIndex, "EEEE");
	return dayOfWeekString;
};

function convertTo12HourFormat(time24) {
	const date = parse(time24, "HH:mm:ss.SSS", new Date());
	return format(date, "hh:mm a");
}
const getStartOfDay = (date) => {
	if (!date) return "";

	const startTimeOfDay = new Date(date);
	startTimeOfDay.setHours(0, 0, 0, 0);

	return startTimeOfDay;
};

const getEndOfDay = (date) => {
	if (!date) return "";

	const endTimeOfDay = new Date(date);
	endTimeOfDay.setHours(23, 59, 59, 999);

	return endTimeOfDay;
};

const CleaningStatus = (status) => {
	switch (status) {
		case "Completed":
			return { text: "Complete", color: "#0A8217" };
		case "Incomplete":
			return { text: "Incomplete", color: "#FF4D00" };
		case "Cancelled":
			return { text: "Cancel", color: "#FCCC3B" };
		default:
			return { text: "-", color: "#0A8217" };
	}
};

export {
	RangeColor,
	getRandomInt,
	RangeColorStatus,
	isOnlyAdmin,
	isAdmin,
	isSuperAdmin,
	permissionPageView,
	formatIsoDate,
	getDayOfWeek,
	convertTo12HourFormat,
	getStartOfDay,
	getEndOfDay,
	CleaningStatus,
	isUserRole
};
