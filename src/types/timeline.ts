export type TimelineEvent = {
  start_date: {
    year: number;
    month?: number | null;
    day?: number | null;
  };
  headline: string;
  text: string;
  // 👇 union type supports both string or object form
  media?: string | { url: string };
};

export type TimelineData = {
  title: {
    text: {
      headline: string;
      text: string;
    };
  };
  events: TimelineEvent[];
};
