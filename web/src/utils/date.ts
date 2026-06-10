export function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(new Date(value));
}