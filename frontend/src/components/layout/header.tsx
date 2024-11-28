import { useSession } from "@/providers/Session.tsx";
import { LogOut, User2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {

  return (
    <div className="bg-gray-950 md:px-2 md:px-12 lg:px-18 w-full">
      <header className={'container mx-auto flex justify-between h-16'}>
        <Link to={'/'}>

        <div className='flex gap-4 items-center'>
          <img src="/images/shopper_logo.png" alt="Logo" className="h-16 w-auto mx-auto"/>
          <h1 className="text-white text-lg md:text-2xl font-bold whitespace-nowrap">Shopper trip</h1>
          Shopper trip
        </div>
        </Link>
        <SessionInfo/>
      </header>
    </div>
  )
}

const SessionInfo = () => {
  const { customer, logout } = useSession()

  if (!customer) {
    return null
  }

  return (
    <div className="flex gap-4 items-center text-white pr-2">
      <Link to="/history">
        <div className='flex gap-2'>
      <User2 size={24} />
      <span>{customer?.name}</span>
        </div>
      </Link>
      <button className='flex gap-2' onClick={logout}>Sair <LogOut/></button>
    </div>
  )
}