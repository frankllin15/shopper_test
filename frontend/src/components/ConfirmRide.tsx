import { useState } from "react";
import { DriverOption, EstimateRideResponseDto } from "@/@types/ride.ts";
import { useConfirmRide } from "@/actions/ride-actions.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { DriverOptionItem } from "@/components/DriverOptionItem.tsx";
import { LocationPath } from "@/@types/location.ts";

type ConfirmRideProps = {
  onCancel: () => void,
  ride: EstimateRideResponseDto,
  requestedLocation: LocationPath
}
export const ConfirmRide = ({
                              onCancel,
                              ride,
                              requestedLocation
                            }: ConfirmRideProps) => {
  const [selectedDriver, setSelectedDriver] = useState<DriverOption>(ride.options[0])
  const { confirmRide } = useConfirmRide()
  const { toast } = useToast()
  const navigate = useNavigate()


  const handleSelect = (id: number) => {
    const driver = ride.options.find(option => option.id === id)
    if (!driver) {
      toast(
        {
          title: 'Motorista não encontrado',
          description: 'Não foi possível encontrar o motorista selecionado',
          variant: 'destructive'
        }
      )
      return
    }
    setSelectedDriver(driver)
  }

  const handleConfirm = () => {
    confirmRide({
      customer_id: 1,
      origin: requestedLocation.origin,
      destination: requestedLocation.destination,
      distance: ride.distance,
      duration: ride.duration,
      driver: {
        id: selectedDriver.id,
        name: selectedDriver.name
      },
      value: ride.options.find(option => option.id === selectedDriver.id)?.value || 0
    }, {

      onSuccess: () => {
        toast({
          title: 'Corrida confirmada',
          description: 'Sua corrida foi confirmada com sucesso',
          variant: 'success'
        })

        navigate('/history')
      }
    })
  }

  return (
    <div className='space-y-4'>

      <h2
        className={'text-xl md:text-2xl font-bold'}>Selecione o motorísta</h2>

      <div className='space-y-4 pb-24 md:pb-2'>
        {
          ride.options.map(option => (
            <DriverOptionItem key={option.id} option={option} onSelect={handleSelect} isSelected={
              option.id === selectedDriver.id
            }/>
          ))
        }
      </div>

      <div className='fixed left-0 md:sticky flex justify-between  bottom-0 w-full bg-gray-50 p-4 shadow'>
        <Button variant='outline' size={"lg"}
                onClick={onCancel}>
          Cancelar
        </Button>
        <Button size='lg' onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  )
}