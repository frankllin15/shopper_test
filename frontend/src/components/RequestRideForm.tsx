import { EstimateRideResponseDto } from "@/@types/ride.ts";
import { LocationPath } from "@/@types/location.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast.ts";
import { Api } from "@/lib/Api.ts";
import { AxiosError } from "axios";
import React from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form.tsx";
import { PlacesAutocomplete } from "@/components/PlacesAutocomplete.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";

type RequestRideFormProps = {
  onResult: (estimative: EstimateRideResponseDto, location: LocationPath) => void;
}
export const RequestRideForm = ({ onResult }: RequestRideFormProps) => {
  const form = useForm<RequestRideType>({
    resolver: zodResolver(requestRideSchema),
    mode: 'onSubmit'
  })
  const { toast } = useToast()
  const onSubmit = async (data: RequestRideType) => {

    const { dismiss } = toast({
      title: 'Solicitando viajem',
      duration: Infinity,
      loading: true
    })

    try {

      const resp = await Api.post<EstimateRideResponseDto>('/ride/estimate', {
        ...data,
        customer_id: "1",
      })

      if (resp.status === 201) {

        onResult(resp.data, { origin: data.origin, destination: data.destination })

      }

    } catch (error) {
      let errorDescription = 'Não foi possível solicitar sua viajem, tente novamente mais tarde'
      if (error instanceof AxiosError) {
        errorDescription = error.response?.data.error_description || errorDescription
      }


      toast({
        title: 'Erro ao solicitar viajem',
        description: errorDescription,
        variant: "destructive"
      })
    } finally {
      dismiss()
    }
  }

  const checkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
  };
  return (
    <Form {...form}>
      <h1 className='text-4xl md:text-6xl font-bold'>Solicite agora sua viajem</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4 md:max-w-md" onKeyDown={checkKeyDown}>
        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PlacesAutocomplete
                  aria-label="Local de origem" placeholder="Local de origem"
                  size={"lg"} className="bg-gray-100 focus:bg-gray-50"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PlacesAutocomplete
                  aria-label="Local de destino" placeholder="Local de destido"
                  size="lg" className="bg-gray-100 focus:bg-gray-50"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button size="lg">
          Solicitar viajem
        </Button>
      </form>
    </Form>
  )
}

const requestRideSchema = z.object({
  origin: z.string().min(2, { message: 'Endereço de origem inválido' }),
  destination: z.string().min(2, { message: 'Endereço de destino inválido' }),
})

type RequestRideType = z.infer<typeof requestRideSchema>