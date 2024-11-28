import * as React from "react";
import Autocomplete from "react-google-autocomplete";
import { cn } from "@/lib/utils.ts";
import { InputProps, inputVariants } from "@/components/ui/input.tsx";

const PlacesAutocomplete= React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, ...props }, ref) => {
    return <Autocomplete
      {...props}
      ref={ref}
      className={cn(inputVariants({ size }), className)}
      apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
      onPlaceSelected={(place) => {

        if (place?.formatted_address && props.onChange)
          props.onChange({
            type: "change",
            target: {
              value: place.formatted_address,
            }
          } as React.ChangeEvent<HTMLInputElement>)
      }}
      options={{
        componentRestrictions: {
          country: 'br',
        },
        types: ['geocode', 'establishment'],
      }}
    />
  });

PlacesAutocomplete.displayName = "PlacesAutocomplete";

export { PlacesAutocomplete };