const showLinks = {
    "a": 405,
    "c": 406,
    "b": 407,
    "d": 408,
    "e": 409,
    "g": 410,
    "i": 411,
    "h": 412,
    "f": 413,
    "k": 414,
    "j": 415,
    "n": 416,
    "o": 417,
    "l": 418,
    "m": 419,
    "p": 420,
    "q": 421,
    "s": 422,
    "u": 423,
    "t": 424,
    "r": 425,
    "v": 426,
    "w": 427,
    "x": 428,
    "y": 430,
    "z": 431,
}


export default function getDefaultProfilePhotoLink(name) {
    const firstLetter = name.charAt(0).toLowerCase();

    const showLink = showLinks[firstLetter];

    return `https://www.svgrepo.com/show/517${showLink}/letter-uppercase-circle-${firstLetter}.svg`;

}