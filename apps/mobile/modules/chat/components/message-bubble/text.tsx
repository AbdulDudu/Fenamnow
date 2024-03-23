import { EMAIL_REGEX, PHONE_REGEX, URL_REGEX } from "@/lib/utils/constants";
import { A } from "@/modules/common/ui/a";
import { Text } from "@gluestack-ui/themed";

export default function TextMessage({
  content,
  isSender
}: {
  content: string;
  isSender: boolean;
}) {
  const parsedContent = () =>
    content.split(" ").map((word: string) => {
      if (URL_REGEX.test(word)) {
        return {
          type: "url",
          href: word,
          word: word
        };
      }

      if (PHONE_REGEX.test(word)) {
        return {
          type: "phone",
          href: `tel:${word}`,
          word
        };
      }

      if (EMAIL_REGEX.test(word)) {
        return {
          type: "email",
          href: `mailto:${word}`,
          word
        };
      }

      return {
        type: "text",
        url: word
      };
    });
  const renderContent = () => {
    return parsedContent().map((word: any, index: number) => {
      if (word.type === "text") {
        return (
          <Text
            key={index}
            fontSize="$md"
            semibold
            sx={{
              _light: {
                color: isSender ? "$white" : "$black"
              },
              _dark: {
                color: isSender ? "$white" : "$white"
              }
            }}
          >
            {word.url}{" "}
          </Text>
        );
      }

      if (
        word.type === "phone" ||
        word.type === "email" ||
        word.type === "url"
      ) {
        return (
          <A
            key={index}
            href={word.href}
            sx={{
              textDecorationLine: "underline",

              _light: {
                color: isSender ? "$white" : "$black"
              },
              _dark: {
                color: isSender ? "$white" : "$white"
              }
            }}
          >
            {word.word}{" "}
          </A>
        );
      }
    });
  };

  return <Text>{renderContent()}</Text>;
}
