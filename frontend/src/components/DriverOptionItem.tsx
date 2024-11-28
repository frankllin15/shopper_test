import { DriverOption } from "@/@types/ride.ts";

type DriverOptionItemProps = {
  option: DriverOption
  onSelect: (id: number) => void,
  isSelected?: boolean
}
export const DriverOptionItem = ({ option, onSelect, isSelected }: DriverOptionItemProps) => {

  return (
    <div
      onClick={() => onSelect(option.id)}
      data-selected={isSelected}
      className='p-4 rounded-md data-[selected=true]:border-black border-transparent border-2 bg-gray-50 cursor-pointer'>
      <div className='flex flex-col mb-2'>
        <div className='flex justify-between gap-2'>

          <h3 className='font-bold text-md md:text-lg'>
            {option.name}
          </h3>
        <p className='font-bold text-md md:text-lg'>
          {
            Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(option.value)

          }
        </p>
        </div>
          <p className='font-semibold text-gray-600 text-sm'>
            {option.vehicle}
          </p>
      </div>


      <p className='text-sm text-gray-700'>
        {option.description}
      </p>
      <div className='mt-4'>
        <div className='flex gap-2'>

          <p>
            Avaliações
          </p>
          <p>
            {
              Array(option.review.rating).fill(null).map(() => (
                '⭐'
              ))
            }
          </p>
        </div>
        <p className='text-sm text-gray-700'>
          {option.review.comment}
        </p>
      </div>
    </div>
  )
}