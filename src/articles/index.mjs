// Registry of all articles (SEO guides). Add new article modules here.
import howMuchToRetire from "./how-much-to-retire.mjs";
import payOffCreditCard from "./pay-off-credit-card-debt.mjs";
import howMuchHouse from "./how-much-house-can-i-afford.mjs";
import howToInvest from "./how-to-start-investing.mjs";
import howToBudget from "./how-to-make-a-budget.mjs";
import rothVsTraditional from "./roth-vs-traditional-ira.mjs";

// Newest first.
export const articles = [
  rothVsTraditional,
  howToBudget,
  howToInvest,
  howMuchHouse,
  payOffCreditCard,
  howMuchToRetire,
];
