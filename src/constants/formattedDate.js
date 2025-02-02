import {translations} from "../providers/translations/translations";


export function getFormattedDate(stringDate, language, smallDate = false){
    const todayDate = new Date();
    const sendDate = new Date(stringDate)

    const hours = sendDate.getHours().toString().length > 1 ?
        sendDate.getHours() : `0${sendDate.getHours()}`
    const minutes = sendDate.getMinutes().toString().length > 1 ?
        sendDate.getMinutes() : `0${sendDate.getMinutes()}`

    const time = `${hours}:${minutes}`;

    const isToday = (sendDate.getDate() === todayDate.getDate()) &&
        (sendDate.getMonth() === todayDate.getMonth()) &&
        (sendDate.getFullYear() === todayDate.getFullYear());
    if (isToday) {
        if (smallDate) {
            return time
        }
        return `${translations.today[language]}, ${time}`
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const isYesterday = (sendDate.getDate() === yesterday.getDate()) &&
        (sendDate.getMonth() === yesterday.getMonth()) &&
        (sendDate.getFullYear() === yesterday.getFullYear());
    if (isYesterday) {
        if (smallDate) {
            return translations.yesterday[language]
        }
        return `${translations.yesterday[language]}, ${time}`
    }

    const day = sendDate.getDate().toString().length > 1 ?
        sendDate.getDate() : `0${sendDate.getDate()}`
    const month = (sendDate.getMonth() + 1).toString().length > 1 ?
        sendDate.getMonth() + 1 : `0${sendDate.getMonth() + 1}`

    const date = `${day}.${month}`;

    const isCurrentYear = sendDate.getFullYear() === todayDate.getFullYear();
    if (isCurrentYear) {
        if (smallDate) {
            return date
        }
        return `${date}, ${time}`
    } else {
        if (smallDate) {
            return `${date}.${sendDate.getFullYear()}`
        }
        return `${date}.${sendDate.getFullYear()}, ${time}`
    }
}

export function isDateBigger(nextDate, currentDate) {
    const d1 = new Date(nextDate);
    const d2 = new Date(currentDate);

    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    return d1.getTime() > d2.getTime();
}

export function isToday(date) {
    const today = new Date();
    const inputDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return today.getTime() === inputDate.getTime();
}

export function isYesterday(date) {
    const today = new Date();
    const inputDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return (today.getTime() - inputDate.getTime()) === 24 * 60 * 60 * 1000;
}