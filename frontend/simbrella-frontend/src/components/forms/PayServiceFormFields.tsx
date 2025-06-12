import { Control } from "react-hook-form";
import { PayServiceInput } from "@/lib/validations/payService";
import { SelectFormField } from "./SelectFormField";
import { AmountFormField } from "./AmountFormField";
import type { Wallet } from "@/services/dataService";

interface PayServiceFormFieldsProps {
  control: Control<PayServiceInput>;
  userWallets: Wallet[];
  serviceWallets: Wallet[];
}

export function PayServiceFormFields({
  control,
  userWallets,
  serviceWallets,
}: PayServiceFormFieldsProps) {
  const activeWallets = userWallets.filter((wallet) => wallet.isActive);
  const activeServices = serviceWallets.filter(
    (wallet) => wallet.isActive && wallet.type === "SYSTEM"
  );

  return (
    <>
      <SelectFormField
        control={control}
        name="fromWalletId"
        label="Select Wallet"
        placeholder="Select a wallet"
        options={activeWallets.map((wallet) => ({
          value: String(wallet.id),
          label: `${wallet.name} - ${
            wallet.currency
          } ${wallet.balance.toLocaleString()}`,
        }))}
      />

      <SelectFormField
        control={control}
        name="serviceId"
        label="Select Service"
        placeholder="Select a service"
        options={activeServices.map((service) => ({
          value: String(service.id),
          label: service.name,
        }))}
      />

      <AmountFormField
        control={control}
        name="amount"
        label="Amount"
        placeholder="0.00"
      />
    </>
  );
}
