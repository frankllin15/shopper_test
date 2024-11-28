import { useForm } from "react-hook-form";
import { loginFormSchema, LoginFormType, useLogin } from "@/actions/customer-actions.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

export const LoginForm = () => {

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema)
  })
  const { login, isLoading } = useLogin()


  const handleSubmit = async (data: LoginFormType) => {
    login(data)

  }

  return (
    <div className='space-y-8 py-12'>

      <h1 className='text-4xl md:text-5xl font-bold '>Faça login para solicitar uma viagem</h1>

      <Form {...form}>
        <form className={'space-y-4 py-4 max-w-md'} onSubmit={form.handleSubmit(handleSubmit)}>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nome de usuário
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>

                  Documento
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input required {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button size="lg" type="submit" loading={isLoading} className="border-white w-full">
            Entrar
          </Button>
        </form>
      </Form>
    </div>
  )
}

