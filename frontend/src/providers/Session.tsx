import { Customer } from "@/@types/customer.ts";
import React, { createContext, useEffect, useState } from "react";

type SessionContextType = {
  customer: Customer | null;
  setCustomer: (customer: Customer) => void;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextType>({
  customer: null,
  setCustomer: () => {},
  logout: () => {}
})


export const SessionProvider = ({ children } : React.PropsWithChildren) => {
  const [customer, setCustomer] = useState<Customer | null>(null)

  const setUser = (customer: Customer) => {
    setCustomer(customer)
    saveLocalSession(customer)
  }

  const logout = () => {
    setCustomer(null)
    clearLocalSession()
  }

  function saveLocalSession(customer: Customer) {
    localStorage.setItem('customer', JSON.stringify(customer))

  }

  function loadLocalSession() {
    const customer = localStorage.getItem('customer')
    if (customer) {
      setCustomer(JSON.parse(customer))
    }
  }

  function clearLocalSession() {
    localStorage.removeItem('customer')
  }

  useEffect(() => {
    loadLocalSession()
  }, []);

  return (
    <SessionContext.Provider value={{ customer, setCustomer: setUser, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = React.useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
