"use client";

import { Check, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DiscountInfo, SelectedTickets, TicketTierUI } from "./types";
import { formatUSD } from "@/lib/utils";

interface CartSidebarProps {
  dictionary: {
    summaryTitle: string;
    subTotal: string;
    discountLabel: string;
    total: string;
    processingFeeNote: string;
    emptySelection: string;
    applyDiscountTitle: string;
    enterCodePlaceholder: string;
    apply: string;
    discountAppliedPrefix: string;
  };
  ticketTiers: TicketTierUI[];
  selectedTickets: SelectedTickets;
  discountCode: string;
  onDiscountCodeChange: (code: string) => void;
  onApplyDiscount: () => void;
  onProceed: () => void;
  proceedLabel: string;
  appliedDiscount: DiscountInfo | null;
  discountError: string | null;
  isApplyingDiscount: boolean;
  isProceedLoading: boolean;
  showDiscountSection: boolean;
  isProceedDisabled: boolean;
}

export function CartSidebar({
  dictionary,
  ticketTiers,
  selectedTickets,
  discountCode,
  onDiscountCodeChange,
  onApplyDiscount,
  onProceed,
  proceedLabel,
  appliedDiscount,
  discountError,
  isApplyingDiscount,
  isProceedLoading,
  showDiscountSection,
  isProceedDisabled,
}: CartSidebarProps) {
  const hasSelection = Object.values(selectedTickets).some((qty) => qty > 0);
  const subTotal = ticketTiers.reduce(
    (sum, tier) => sum + Number(tier.price) * (selectedTickets[tier.slug] || 0),
    0,
  );

  // Calculate discount amount
  let discountAmount = 0;
  if (appliedDiscount) {
    const discountValue = Number(appliedDiscount.discountValue);
    if (appliedDiscount.discountType === "PERCENTAGE") {
      discountAmount = (subTotal * discountValue) / 100;
    } else {
      discountAmount = Math.min(discountValue, subTotal);
    }
  }
  const total = subTotal - discountAmount;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      {hasSelection ? (
        <div className="w-full">
          <p className="text-base font-bold text-foreground">
            {dictionary.summaryTitle}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {ticketTiers
              .filter((t) => (selectedTickets[t.slug] || 0) > 0)
              .map((tier) => (
                <div
                  key={tier.slug}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {tier.name}
                    <span className="ml-2 text-xs text-muted-foreground/70">
                      {"x "}
                      {selectedTickets[tier.slug]}
                    </span>
                  </span>
                  <span className="font-medium text-foreground">
                    {formatUSD(
                      Number(tier.price) * (selectedTickets[tier.slug] || 0),
                    )}
                  </span>
                </div>
              ))}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{dictionary.subTotal}</span>
              <span>{formatUSD(subTotal)}</span>
            </div>
            {appliedDiscount && discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>
                  {dictionary.discountLabel + " (" + appliedDiscount.code + ")"}
                </span>
                <span>{"- " + formatUSD(discountAmount)}</span>
              </div>
            )}
            <div className="border-t border-border pt-2">
              <div className="flex items-center justify-between text-base font-bold">
                <span className="text-foreground">{dictionary.total}</span>
                <span className="text-foreground">
                  {formatUSD(total)}
                  {"*"}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-destructive">
              {dictionary.processingFeeNote}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {dictionary.emptySelection}
          </p>
        </div>
      )}

      {showDiscountSection && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-foreground">
            {dictionary.applyDiscountTitle}
          </p>
          <div className="mt-2 flex gap-2">
            <Input
              placeholder={dictionary.enterCodePlaceholder}
              value={discountCode}
              onChange={(e) => onDiscountCodeChange(e.target.value)}
              className="bg-card"
              disabled={!!appliedDiscount}
            />
            <Button
              variant="outline"
              onClick={onApplyDiscount}
              className="shrink-0 bg-transparent"
              disabled={isApplyingDiscount || !!appliedDiscount}
            >
              {isApplyingDiscount ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : appliedDiscount ? (
                <Check className="h-4 w-4" />
              ) : (
                dictionary.apply
              )}
            </Button>
          </div>
          {discountError && (
            <p className="mt-1 text-xs text-destructive">{discountError}</p>
          )}
          {appliedDiscount && (
            <p className="mt-1 text-xs text-green-600">
              {dictionary.discountAppliedPrefix +
                (appliedDiscount.description || appliedDiscount.code)}
            </p>
          )}
        </div>
      )}

      {/* Proceed / Checkout Button */}
      <Button
        className="mt-4 w-full"
        size="lg"
        onClick={onProceed}
        disabled={!hasSelection || isProceedLoading || isProceedDisabled}
      >
        {isProceedLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {proceedLabel}
      </Button>
    </div>
  );
}
