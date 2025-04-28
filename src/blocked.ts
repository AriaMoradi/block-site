import { VALIDATORS, CounterPeriod } from "./storage";
import getBlockedMessage from "./helpers/get-blocked-message";

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const url = params.get("url");
  if (!url) {
    return;
  }

  const rule = params.get("rule");
  if (!rule) {
    return;
  }

  const count = parseInt(params.get("count") || "");
  const period = params.get("period");
  const countParams = (!isNaN(count) && VALIDATORS.counterPeriod(period))
    ? { count, period: period as CounterPeriod }
    : undefined;

  const message = getBlockedMessage({
    url,
    rule,
    countParams,
  });

  (document.getElementById("message") as HTMLParagraphElement).innerHTML = message;

  const tempUnblockButton = document.getElementById("temp-unblock-button");
  const tempUnblockDurationInput = document.getElementById("temp-unblock-duration") as HTMLInputElement;

  if (tempUnblockButton && tempUnblockDurationInput) {
    tempUnblockButton.addEventListener("click", () => {
      const durationMinutes = parseInt(tempUnblockDurationInput.value, 10);
      if (isNaN(durationMinutes) || durationMinutes <= 0) {
        alert("Please enter a valid duration in minutes.");
        return;
      }

      // Send message to background script to temporarily unblock
      chrome.runtime.sendMessage({
        action: "tempUnblock",
        url: url, // The URL that was blocked
        rule: rule, // The rule that caused the block
        durationMinutes: durationMinutes,
      }, (response) => {
        if (response && response.success) {
          console.log(`Successfully temporarily unblocked ${url} for ${durationMinutes} minutes.`);
        } else {
          console.log("response", response);
        }
      });
    });
  }

  document.body.classList.add("ready");
});
