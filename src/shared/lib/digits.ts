const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function toAsciiDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const persianIndex = PERSIAN_DIGITS.indexOf(digit);
    if (persianIndex >= 0) return String(persianIndex);

    return String(ARABIC_DIGITS.indexOf(digit));
  });
}

export function toPersianDigits(value: string) {
  return toAsciiDigits(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}
