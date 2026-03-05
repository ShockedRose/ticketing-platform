"use client";

import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/utils";

interface PaymentStepProps {
  dictionary: {
    title: string;
    descriptionPrefix: string;
    zeroTotalDescriptionPrefix: string;
    orderIdPrefix: string;
    back: string;
  };
  onBack: () => void;
  total: number;
  orderId: string | null;
  onPrimaryAction: () => void;
  primaryActionLabel: string;
  isPrimaryLoading: boolean;
  isZeroTotalOrder?: boolean;
  showExternalLinkIcon?: boolean;
}

export function PaymentStep({
  dictionary,
  onBack,
  total,
  orderId,
  onPrimaryAction,
  primaryActionLabel,
  isPrimaryLoading,
  isZeroTotalOrder = false,
  showExternalLinkIcon = false,
}: PaymentStepProps) {
  const descriptionPrefix = isZeroTotalOrder
    ? dictionary.zeroTotalDescriptionPrefix
    : dictionary.descriptionPrefix;

  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <CreditCard className="mx-auto h-14 w-14 text-primary" />
      <h3 className="mt-4 text-xl font-bold text-foreground">
        {dictionary.title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {descriptionPrefix}
        <span className="font-semibold text-foreground">
          {formatUSD(total)}
        </span>
        .
      </p>

      <div className="mx-auto mt-6 flex max-w-xs flex-col gap-3">
        <Button
          size="lg"
          className="gap-2"
          onClick={onPrimaryAction}
          disabled={isPrimaryLoading}
        >
          {isPrimaryLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {primaryActionLabel}
              {showExternalLinkIcon ? <ExternalLink className="h-4 w-4" /> : null}
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onBack} disabled={isPrimaryLoading}>
          {dictionary.back}
        </Button>
      </div>
    </div>
  );
}
