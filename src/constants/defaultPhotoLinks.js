export default function getDefaultProfilePhotoLink(name) {
    const firstLetter = name.charAt(0).toLowerCase();

    return `/letters/${firstLetter}.svg`;
}