import { RideDto } from "@/@types/ride.ts";
import { useRides } from "@/actions/ride-actions.tsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatSeconds } from "@/lib/utils.ts";
import { useSession } from "@/providers/Session.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { Api } from "@/lib/Api.ts";
import { DriverDto } from "@/@types/driver.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { useState } from "react";
export default function HistoryPage() {
  const {customer} = useSession()

  return (
    <div className="container mx-auto lg:max-w-4xl">
      <div className="pt-8 px-2  md:px-12 lg:px-18 h-screen">

        {
          !customer?.id ? (
            <div className="flex flex-col gap-8 justify-center items-center h-full">

              <p className="text-2xl font-bold">
                Faça login para acessar o histórico de viagens
              </p>
              <Link to={'/'}>

              <Button variant="outline" size="lg"  className="ml-4">
                Ir para o inicio
              </Button>
              </Link>
            </div>
          ) : (


        <RidesList customerId={customer.id}/>
          )
        }
      </div>
    </div>
  )
}

type RidesListType = {
  customerId: number;

}

const RidesList = ({ customerId }: RidesListType) => {
  const [driverId, setDriverId] = useState<string | null>(null)
  const { rides, error } = useRides(customerId.toString(), driverId)
  const { data:drivers} =useQuery({
    queryKey: 'drivers',
    queryFn: async () => {
      const resp = await Api.get<DriverDto[]>('/driver')
      return resp.data
    }
  })

  return (
    <div>
      <h1 className="text-2xl md:text-4xl font-bold mb-8">
        Histórico de viagens
      </h1>

      <div>
        <Select value={driverId ||''} onValueChange={setDriverId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Motorista" />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value={'0'}>
            Todos
          </SelectItem>
            {
              drivers?.map(driver => (
                <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
        {
          error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
              <span className="block sm:inline">{error.response?.data.error_description}</span>
            </div>
          )
        }
      <div className="grid grid-cols-1 gap-4 my-4">
        {rides?.map(ride => (
          <RideCard key={ride.id} ride={ride}/>
        ))}
      </div>
      </div>
    </div>
  )
}

type RideCardProps = {
  ride: RideDto;
}
const RideCard = ({ ride }: RideCardProps) => {


  return (
    <div className="grid grid-cols-[auto,1fr] gap-4 border  rounded-xl shadow px-4 py-6">
      <div className="h-24 w-24 flex items-center justify-center">
        <img src={ride.driver.vehicle_image} alt="Carro"/>
      </div>
      <div>

        <div className="flex justify-between">

          <div className="flex flex-col md:flex-row gap-2 items-center">
            <p className="text-xl font-bold">{ride.origin}</p>
            <span className='max-h-min hidden md:block'>
            {"•"}
            </span>
            <p className="text-xl font-bold">{ride.destination}</p>
          </div>
          <p className="font-semibold">
            {
              Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(ride.value)
            }

          </p>
        </div>
        <div className="flex justify-between">
        <p className="text-gray-600">
          {ride.driver.name}
        </p>
        <p>
          {

            format(new Date(ride.date), "d 'de' MMM 'de' yyyy", {locale: ptBR})
            }
        </p>
        </div>
        <div className="flex gap-2">
        <p>
          {formatSeconds(Number(ride.duration.replace('s', '')))}
        </p>
•
        <p>
          {
            Intl.NumberFormat('pt-BR', {
              style: 'unit',
              unit: 'kilometer'
            }).format(ride.distance)
          }
        </p>
        </div>
      </div>
    </div>
  )
}
