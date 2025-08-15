import { diffChars } from "diff";

export function getHighlightedDiff(oldStr: string, newStr: string) {
  return diffChars(oldStr, newStr).map((part, index) => {
    let color = "";
    if (part.added) color = "bg-green-200 text-green-800 dark:bg-green-800 dark:text-bg-green-200"; // Added text
    if (part.removed) color = "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200";   // Removed text

    const text = part.value;

    return (
      <span key={index} className={color}>
        {text}
      </span>
    );
  });
}