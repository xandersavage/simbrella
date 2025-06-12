"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Form } from "@/components/ui/form";
import { CreditCard } from "lucide-react";
import { payService } from "@/services/dataService";
import type { Wallet as WalletType } from "@/services/dataService";
import {
  payServiceSchema,
  type PayServiceInput,
} from "@/lib/validations/payService";
import { PayServiceFormFields } from "@/components/forms/PayServiceFormFields";
import { useServices } from "@/hooks/useUserData";

interface PayServiceDialogProps {
  userWallets: WalletType[];
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function PayServiceDialog({
  userWallets,
  onSuccess,
  children,
}: PayServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: services, isLoading: isServicesLoading } = useServices();

  const form = useForm<PayServiceInput>({
    resolver: zodResolver(payServiceSchema),
    defaultValues: {
      fromWalletId: "",
      serviceId: "",
      amount: 0,
    },
  });

  async function onSubmit(values: PayServiceInput) {
    setIsLoading(true);
    try {
      await payService({
        fromWalletId: values.fromWalletId,
        serviceId: values.serviceId,
        amount: values.amount,
      });

      toast({
        title: "Success!",
        description: "Service payment completed successfully.",
        variant: "default",
      });

      setOpen(false);
      form.reset();

      await queryClient.invalidateQueries({ queryKey: ["userWallets"] });
      await queryClient.invalidateQueries({ queryKey: ["userTransactions"] });

      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process payment";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Map services to service wallets for the form
  const serviceWallets =
    services
      ?.filter((service) => service.isActive)
      .map((service) => ({
        id: service.id,
        name: service.name,
        type: "SYSTEM",
        balance: 0,
        currency: "NGN",
        isActive: service.isActive,
        serviceId: service.id,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      })) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            size="sm"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors shadow-sm hover:shadow-md"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Pay for Service
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Pay for Service
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Make a payment for a service using your wallet. Fill in the details
            below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <PayServiceFormFields
              control={form.control}
              userWallets={userWallets}
              serviceWallets={serviceWallets}
            />

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading || isServicesLoading}
                className="flex-1 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isServicesLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Pay Now"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
