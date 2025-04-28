import { CounterPeriod } from "../storage";
import { GetBlockedUrlParams } from "./get-blocked-url";

const periodStrings: Record<CounterPeriod, string> = {
  ALL_TIME: "overall",
  THIS_MONTH: "this month",
  THIS_WEEK: "this week",
  TODAY: "today",
};

export default ({ url, rule, countParams: cp }: GetBlockedUrlParams): string => {
  const baseMessage = `<span id="url"><a href="${url}" >${url}</a></span> <b>was blocked</b> by <span id="rule">${rule}</span>`;
  const countMessage = cp ? ` (${cp.count}x ${periodStrings[cp.period]})` : "";
  return `${baseMessage}${countMessage}`;
};
