import { createContext, useContext, useState } from "react";

const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [activeOwner, setActiveOwner] = useState(() => {
    const saved = sessionStorage.getItem("activeOwner");
    return saved ? JSON.parse(saved) : null;
  });

  const setOwner = (owner) => {
    setActiveOwner(owner);
    if (owner) {
      sessionStorage.setItem("activeOwner", JSON.stringify(owner));
    } else {
      sessionStorage.removeItem("activeOwner");
    }
  };

  return (
    <BudgetContext.Provider value={{ activeOwner, setActiveOwner: setOwner }}>
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => useContext(BudgetContext);
