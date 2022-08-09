import { asText } from '@prismicio/helpers';

type Content = {
  heading: string;
  body: {
    text: string;
  }[];
}[];

export function timeToRead(content: Content): number {
  const wordsPerMinute = 200;
  const words = content.reduce((acc, { heading, body }) => {
    return (
      acc + heading.split(' ').length + asText<any>(body).split(' ').length
    );
  }, 0);

  return Math.ceil(words / wordsPerMinute);
}
