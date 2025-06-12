import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>;
  name: FieldPath<TFormSchema>;
  label: string;
  placeholder: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  className?: string;
}

export function SelectFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  className,
}: SelectFormFieldProps<TFormSchema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 dark:text-gray-300">
            {label}
          </FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger
                className={
                  className ||
                  "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                }
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              {options.map((option, index) => (
                <SelectItem
                  key={`${option.value}-${index}`}
                  value={option.value}
                  className="focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
