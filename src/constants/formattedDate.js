import {translations} from "../providers/translations/translations";
import {useLanguage} from "../providers/translations/LanguageProvider";


export function getFormattedDate(stringDate, language){
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
        return `${translations.today[language]}, ${time}`
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const isYesterday = (sendDate.getDate() === yesterday.getDate()) &&
        (sendDate.getMonth() === yesterday.getMonth()) &&
        (sendDate.getFullYear() === yesterday.getFullYear());
    if (isYesterday) {
        return `${translations.yesterday[language]}, ${time}`
    }

    const date = `${sendDate.getDate()}.${sendDate.getMonth() + 1}`;

    const isCurrentYear = sendDate.getFullYear() === todayDate.getFullYear();
    if (isCurrentYear) {
        return `${date}, ${time}`
    } else {
        return `${date}.${sendDate.getFullYear()}, ${time}`
    }
}