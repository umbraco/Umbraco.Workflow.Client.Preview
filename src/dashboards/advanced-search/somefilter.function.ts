/**
 * Check the property for a non-empty value
 * @param p
 * @returns true if the property has a value
 */
export function SomeFilter(p) {
  return (
    p.value !== null &&
    p.value !== undefined &&
    p.value !== "" &&
    p.value !== "0" 
    // &&
    // typeof p.value !== "object"
  );
}
