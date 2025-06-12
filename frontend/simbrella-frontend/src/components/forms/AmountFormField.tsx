import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AmountFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>;
  name: FieldPath<TFormSchema>;
  label: string;
  placeholder: string;
  currencySymbol?: string;
  className?: string;
}

export function AmountFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  currencySymbol = "₦",
  className,
}: AmountFormFieldProps<TFormSchema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 dark:text-gray-300">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">
                {currencySymbol}
              </span>
              <Input
                type="number"
                placeholder={placeholder}
                className={`pl-7 ${
                  className ||
                  "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                }`}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
