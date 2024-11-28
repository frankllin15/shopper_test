import { useSession } from "@/providers/Session.tsx";
import { useMutation } from "react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast.ts";
import { Api } from "@/lib/Api.ts";
import { AxiosError } from "axios";

export const useLogin = () => {
  const {setCustomer} = useSession()
  const {toast} = useToast()
  const {mutate: login, isLoading} = useMutation({
    mutationFn: async (data: LoginFormType) => {
      const {dismiss} = toast({
        title: 'Realizando login',
        duration: Infinity,
        loading: true
      })

      try {
        // Simulando login
        const response = await Api.post('/customer/login', data)

        const customer = response.data
        if (customer) {
          setCustomer(customer)
        }
      } catch (error) {
        let errorDescription = 'Não foi possível fazer login, tente novamente mais tarde'
        if (error instanceof AxiosError) {
          errorDescription = error.response?.data.error_description || errorDescription
        }
        toast({
          title: 'Erro ao fazer login',
          description: errorDescription,
          variant: "destructive"
        })
      } finally {
        dismiss()
      }
    },
  })

  return {
    login,
    isLoading
  }
}

export const loginFormSchema = z.object(
  {
    name: z.string().optional(),
    document: z.string().min(6, { message: 'Documento deve ter no mínimo 6 caracteres' }),
  }
)

export type LoginFormType = z.infer<typeof loginFormSchema>