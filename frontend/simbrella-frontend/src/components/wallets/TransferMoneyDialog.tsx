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
import { Send } from "lucide-react";
import { transferMoney } from "@/services/dataService";
import type { Wallet as WalletType } from "@/services/dataService";
import {
  transferMoneySchema,
  type TransferMoneyInput,
} from "../../lib/validations/transferMoney";
import { SelectFormField } from "@/components/forms/SelectFormField";
import { AmountFormField } from "@/components/forms/AmountFormField";
import { TextFormField } from "@/components/forms/TextFormField";

interface TransferMoneyDialogProps {
  userWallets: WalletType[];
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function TransferMoneyDialog({
  userWallets,
  onSuccess,
  children,
}: TransferMoneyDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TransferMoneyInput>({
    resolver: zodResolver(transferMoneySchema),
    defaultValues: {
      fromWalletId: "",
      toWalletId: "",
      amount: 0,
      description: "",
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  async function onSubmit(values: TransferMoneyInput) {
    setIsLoading(true);
    try {
      await transferMoney({
        fromWalletId: values.fromWalletId,
        toWalletId: values.toWalletId,
        amount: values.amount,
        description: values.description,
      });

      toast({
        title: "Success!",
        description: "Money transferred successfully.",
        variant: "default",
      });

      setOpen(false);
      form.reset();

      await queryClient.invalidateQueries({ queryKey: ["userWallets"] });
      await queryClient.invalidateQueries({ queryKey: ["userTransactions"] });

      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to transfer money";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const activeWallets = userWallets.filter((wallet) => wallet.isActive);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            size="sm"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors shadow-sm hover:shadow-md"
          >
            <Send className="h-4 w-4 mr-2" />
            Transfer Money
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Transfer Money
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Transfer money between your wallets. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <SelectFormField
              control={form.control}
              name="fromWalletId"
              label="From Wallet"
              placeholder="Select source wallet"
              options={activeWallets.map((wallet) => ({
                value: String(wallet.id),
                label: `${wallet.name} - ${
                  wallet.currency
                } ${wallet.balance.toLocaleString()}`,
              }))}
            />

            <SelectFormField
              control={form.control}
              name="toWalletId"
              label="To Wallet"
              placeholder="Select destination wallet"
              options={activeWallets.map((wallet) => ({
                value: String(wallet.id),
                label: `${wallet.name} - ${
                  wallet.currency
                } ${wallet.balance.toLocaleString()}`,
              }))}
            />

            <AmountFormField
              control={form.control}
              name="amount"
              label="Amount"
              placeholder="0.00"
            />

            <TextFormField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Enter transfer description"
            />

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
                disabled={isLoading || !form.formState.isValid}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Transfer Now"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
