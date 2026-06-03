// Registry of all calculators. Add new calculator modules here.
import compoundInterest from "./compound-interest.mjs";
import loan from "./loan.mjs";
import retirement from "./retirement.mjs";
import mortgage from "./mortgage.mjs";
import savingsGoal from "./savings-goal.mjs";
import creditCardPayoff from "./credit-card-payoff.mjs";
import roi from "./roi.mjs";
import inflation from "./inflation.mjs";
import cd from "./cd.mjs";

export const calculators = [
  compoundInterest,
  savingsGoal,
  roi,
  inflation,
  cd,
  retirement,
  mortgage,
  loan,
  creditCardPayoff,
];
