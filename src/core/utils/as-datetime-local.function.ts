export function asDatetimeLocal(date?: Date) {
    date = date ?? new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    return date.toISOString().slice(0,16);
}