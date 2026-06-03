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
import autoLoan from "./auto-loan.mjs";
import simpleInterest from "./simple-interest.mjs";
import ruleOf72 from "./rule-of-72.mjs";
import netWorth from "./net-worth.mjs";
import emergencyFund from "./emergency-fund.mjs";
import k401 from "./401k.mjs";
import downPayment from "./down-payment.mjs";

export const calculators = [
  compoundInterest,
  savingsGoal,
  emergencyFund,
  roi,
  ruleOf72,
  simpleInterest,
  inflation,
  cd,
  netWorth,
  retirement,
  k401,
  mortgage,
  downPayment,
  loan,
  autoLoan,
  creditCardPayoff,
];
