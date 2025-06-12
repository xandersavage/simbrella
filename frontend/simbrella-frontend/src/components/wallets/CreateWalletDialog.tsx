"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
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
import { Plus } from "lucide-react";
import api from "@/lib/api";

// Define the form schema
const createWalletSchema = z.object({
  name: z.string().min(1, "Wallet name is required"),
  type: z.enum(["PERSONAL", "BUSINESS", "SAVINGS"], {
    required_error: "Please select a wallet type",
  }),
  currency: z.enum(["NGN"], {
    required_error: "Please select a currency",
  }),
});

type CreateWalletInput = z.infer<typeof createWalletSchema>;

interface CreateWalletDialogProps {
  onSuccess?: () => void;
}

export function CreateWalletDialog({ onSuccess }: CreateWalletDialogProps) {  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateWalletInput>({
    resolver: zodResolver(createWalletSchema),
    defaultValues: {
      name: "",
      type: "PERSONAL",
      currency: "NGN",
    },
  });

  async function onSubmit(values: CreateWalletInput) {
    setIsLoading(true);
    try {
      await api.post("/wallets", values);

      toast({
        title: "Success!",
        description: "Wallet created successfully.",
        variant: "default",
      });      // Close the dialog and reset form
      setOpen(false);
      form.reset();

      // Invalidate and refetch wallets query
      await queryClient.invalidateQueries({ queryKey: ['userWallets'] });

      // Call the onSuccess callback if provided
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create wallet";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Wallet
        </Button>
      </DialogTrigger>{" "}
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create New Wallet
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Create a new wallet to manage your finances. Fill in the details
            below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Wallet Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Personal Wallet"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Wallet Type
                  </FormLabel>{" "}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Select wallet type" />
                      </SelectTrigger>
                    </FormControl>{" "}
                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <SelectItem
                        value="PERSONAL"
                        className="focus:bg-gray-100 dark:focus:bg-gray-800"
                      >
                        Personal
                      </SelectItem>
                      <SelectItem
                        value="BUSINESS"
                        className="focus:bg-gray-100 dark:focus:bg-gray-800"
                      >
                        Business
                      </SelectItem>
                      <SelectItem
                        value="SAVINGS"
                        className="focus:bg-gray-100 dark:focus:bg-gray-800"
                      >
                        Savings
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Currency
                  </FormLabel>{" "}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <SelectItem
                        value="NGN"
                        className="focus:bg-gray-100 dark:focus:bg-gray-800"
                      >
                        NGN (₦)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
                className="flex-1 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Wallet"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
