import { useMutation, useQuery } from "react-query";
import { Api } from "@/lib/Api.ts";
import { ConfirmRideDto, GetRidesResponse, RideDto } from "@/@types/ride.ts";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast.ts";
import { ApiException } from "@/@types/api.ts";
// onError: (error) => {
//   let errorDescription = 'Não foi possível confirmar sua viajem, tente novamente mais tarde'
//   if (error instanceof AxiosError) {
//     errorDescription = error.response?.data.error_description || errorDescription
//   }
//   toast({
//     title: 'Erro ao confirmar viajem',
//     description: errorDescription,
//     variant: 'destructive'
//   })
// },
//   onSuccess: () => {
//   toast({
//     title: 'Corrida confirmada',
//     description: 'Sua viajem foi confirmada com sucesso',
//     variant: 'success'
//   })
export const useConfirmRide = () => {
  const { toast } = useToast()
  const {mutate: confirmRide, isLoading} = useMutation({
    mutationFn: (data: ConfirmRideDto) => {
      const {dismiss} = toast(
        {
          title: "Confirmando viajem",
          loading: true,
        }
      )
      try {

      return Api.patch('/ride/confirm',
        data
      )
      } catch (error) {
        let errorDescription = 'Não foi possível confirmar sua viajem, tente novamente mais tarde'
        if (error instanceof AxiosError) {
          errorDescription = error.response?.data.error_description || errorDescription
        }

        toast({
          title: 'Erro ao confirmar viajem',
          description: errorDescription,
          variant: 'destructive'
        })

        throw error
      } finally {
        dismiss()
      }
    },
  })

  return {
    confirmRide,
    isLoading
  }
}

export const useRides = (customerId: string, driverId: string|null) => {
  const {data, isLoading, error} = useQuery<RideDto[], AxiosError<ApiException>>({
    retry: 0,
    queryKey: ['rides', customerId, driverId],
    queryFn: async () => {
      const resp = await Api.get<GetRidesResponse>(`/ride/${customerId}?driver_id=${driverId||''}`)

      return resp.data.rides
    },
    refetchOnWindowFocus: false
  })

  return {
    rides: data,
    isLoading,
    error
  }
}