import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TextFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>;
  name: FieldPath<TFormSchema>;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel" | "password";
  className?: string;
}

export function TextFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  className,
}: TextFormFieldProps<TFormSchema>) {
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
            <Input
              type={type}
              placeholder={placeholder}
              className={
                className ||
                "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              }
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
