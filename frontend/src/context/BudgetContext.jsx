import { createContext, useContext, useState } from "react";

const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [activeOwner, setActiveOwner] = useState(null); // null = свій бюджет

  return (
    <BudgetContext.Provider value={{ activeOwner, setActiveOwner }}>
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => useContext(BudgetContext);
