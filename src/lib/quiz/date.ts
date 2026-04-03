const QUIZ_TIME_ZONE = "Asia/Shanghai";

function formatPart(date: Date, part: "year" | "month" | "day") {
  return (
    new Intl.DateTimeFormat("en-CA", {
      timeZone: QUIZ_TIME_ZONE,
      [part]: "2-digit",
    } as Intl.DateTimeFormatOptions)
      .format(date)
      .trim()
  );
}

export function getQuizDateKey(date = new Date()) {
  const year = new Intl.DateTimeFormat("en-CA", {
    timeZone: QUIZ_TIME_ZONE,
    year: "numeric",
  })
    .format(date)
    .trim();

  return `${year}-${formatPart(date, "month")}-${formatPart(date, "day")}`;
}

export function formatQuizDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-");
  if (!year || !month || !day) {
    return dateKey;
  }

  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

export function getQuizDayOffset(fromDateKey: string, toDateKey: string) {
  const from = new Date(`${fromDateKey}T00:00:00+08:00`);
  const to = new Date(`${toDateKey}T00:00:00+08:00`);
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}
