"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFromUTC = exports.convertToUTC = void 0;
function convertToUTC(dateString, timeString) {
    let adjustedDate;
    if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString)) {
        let dateLocal = new Date(`${dateString}T${timeString}`);
        let localTimeInMilliseconds = dateLocal.getTime();
        adjustedDate = new Date(localTimeInMilliseconds);
    }
    else {
        adjustedDate = new Date(`${dateString}T07:00:00`);
    }
    return adjustedDate;
}
exports.convertToUTC = convertToUTC;
function convertFromUTC(dateString, timeString) {
    let adjustedDate;
    if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString)) {
        let dateInUTC = new Date(`${dateString}T${timeString}Z`);
        let utcTimeInMilliseconds = dateInUTC.getTime() - 5 * 60 * 60 * 1000;
        adjustedDate = new Date(utcTimeInMilliseconds);
    }
    else {
        adjustedDate = new Date(`${dateString}T07:00:00`);
    }
    return adjustedDate;
}
exports.convertFromUTC = convertFromUTC;
