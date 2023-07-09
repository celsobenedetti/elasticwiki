import { HIGHLIGHT_DELIMITER, HIGHLIGHT_TAG } from "@/lib/search";

function stripDelimiter(text: string) {
  return text.slice(1, -1);
}

/**Parses Elasticsearch highlight reponse into JSX <p/> element with each highlight enclosed in a <em/> tag*/
export function HighlightedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={className}>
      {text.split(HIGHLIGHT_TAG).map((segment, i) => {
        if (
          segment.startsWith(HIGHLIGHT_DELIMITER) &&
          segment.endsWith(HIGHLIGHT_DELIMITER)
        ) {
          return (
            <em key={i.toString() + segment}>{stripDelimiter(segment)}</em>
          );
        }
        return segment;
      })}
    </p>
  );
}
