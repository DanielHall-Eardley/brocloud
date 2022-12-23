const { format, differenceInDays, parseISO } = require("date-fns");

const formatTimestamp = (timestamp) => {
  try {
    const timeOfPost = parseISO(timestamp);
    const now = new Date();
    const checkDay = differenceInDays(timeOfPost, now);

    if (checkDay === 0) {
      return `Today at ${format(timeOfPost, "h:m aaa")}`;
    }

    if (checkDay === 1) {
      return `Yesterday at ${format(timeOfPost, "h:m aaa")}`;
    }

    if (checkDay > 1 && checkDay < 7) {
      return format(timeOfPost, "EEEE h:m aaa");
    }

    return format(timeOfPost, "MMM do h:m aaa");
  } catch (error) {
    return "No date recorded";
  }
};

module.exports = formatTimestamp;
