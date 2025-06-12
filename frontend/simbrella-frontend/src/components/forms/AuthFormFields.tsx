// This file provides reusable components for forms using React Hook Form and Shadcn UI.
// It simplifies creating form fields with built-in validation and error display.

"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HTMLInputTypeAttribute } from "react";

// Define props for the CustomFormField component.
// TFormSchema extends FieldValues, allowing it to work with any Zod schema.
interface CustomFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>; // Control object from useForm hook
  name: FieldPath<TFormSchema>; // Name of the field in the form schema
  label: string; // Label to display for the input
  placeholder?: string; // Placeholder text for the input
  type?: HTMLInputTypeAttribute; // HTML input type (e.g., "text", "password", "email")
  description?: string; // Optional description for the field
  // Any additional props to pass directly to the Input component
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/**
 * A reusable form field component that integrates with React Hook Form.
 * It displays a label, input, and validation message.
 *
 * @param {CustomFormFieldProps} props - The props for the form field.
 */
export function CustomFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  description,
  inputProps,
}: CustomFormFieldProps<TFormSchema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              {...field} // Binds input to React Hook Form: onChange, onBlur, value, name
              {...inputProps} // Apply any additional input props
              className="rounded-md" // Add rounded corners using Tailwind
            />
          </FormControl>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormMessage className="text-red-500" />{" "}
          {/* Displays Zod validation errors */}
        </FormItem>
      )}
    />
  );
}

// You might also want to add a generic submit button if it's common across forms
// import { Button } from "@/components/ui/button";
// interface SubmitButtonProps {
//   loading: boolean;
//   buttonText: string;
//   loadingText?: string;
// }
// export function SubmitButton({ loading, buttonText, loadingText = "Submitting..." }: SubmitButtonProps) {
//   return (
//     <Button type="submit" className="w-full rounded-md" disabled={loading}>
//       {loading ? loadingText : buttonText}
//     </Button>
//   );
// }
