/**
 * Formats the date to be compatible with the input type datetime-local
 * Lifted from CMS scheduled publish modal
 * @param {string} dateStr The date to format, example: 2021-01-01T12:00:00.000+01:00
 * @returns {string | undefined} The formatted date in local time with no offset, example: 2021-01-01T11:00
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";

  const d = new Date(dateStr);

  if (isNaN(d.getTime())) {
    console.warn("[Schedule]: Invalid date:", dateStr);
    return "";
  }

  // We need to subtract the offset to get the correct time in the input field
  // the input field expects local time without offset and the Date object will convert the date to local time
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0") +
    "T" +
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0")
  );
}
