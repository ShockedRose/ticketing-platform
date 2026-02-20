"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Check, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  createOrder,
  createPaymentUrl,
  updateOrderToAwaitingPayment,
} from "@/lib/actions/order.actions";
import { validateDiscountCode } from "@/lib/actions/discount.actions";
import { AttendeeDetailsStep } from "./attendee-details-step";
import { CartSidebar } from "./cart-sidebar";
import { MAX_TICKETS_PER_BUYER, STEPS } from "./constants";
import { PaymentStep } from "./payment-step";
import { StepSidebar } from "./step-sidebar";
import { TicketCard } from "./ticket-card";
import type { AttendeeData, BuyerData, DiscountInfo, SelectedTickets, TicketTierUI } from "./types";
import { useSessionTimer } from "./use-session-timer";
import { formatUSD } from "./utils";

interface RegistrationFlowProps {
  ticketTiers: TicketTierUI[];
  attendeInitialData: AttendeeData;
}

export function RegistrationFlow({
  ticketTiers,
  attendeInitialData,
}: RegistrationFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTickets>({});
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountInfo | null>(
    null,
  );
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isProceedLoading, setIsProceedLoading] = useState(false);
  const [isPayLoading, setIsPayLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [buyer, setBuyer] = useState<BuyerData>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [attendees, setAttendees] = useState<AttendeeData[]>([]);

  const timer = useSessionTimer(1, currentStep);

  const totalSelectedTickets = Object.values(selectedTickets).reduce(
    (sum, qty) => sum + qty,
    0,
  );
  const hasSelection = totalSelectedTickets > 0;

  function updateTicketQuantity(slug: string, change: 1 | -1) {
    setSelectedTickets((prev) => {
      const currentQty = prev[slug] || 0;
      const nextQty = Math.max(0, currentQty + change);
      const currentTotal = Object.values(prev).reduce(
        (sum, qty) => sum + qty,
        0,
      );
      const nextTotal = currentTotal - currentQty + nextQty;

      if (nextTotal > MAX_TICKETS_PER_BUYER) {
        return prev;
      }

      return {
        ...prev,
        [slug]: nextQty,
      };
    });

    // Clear discount when selection changes
    setAppliedDiscount(null);
    setDiscountError(null);
  }

  function createEmptyAttendee(): AttendeeData {
    return structuredClone(attendeInitialData);
  }

  const selectedSlugs = Object.entries(selectedTickets)
    .filter(([, qty]) => qty > 0)
    .map(([slug]) => slug);

  const selectedTicketLabels = useMemo(
    () =>
      ticketTiers.flatMap((tier) =>
        Array.from(
          { length: selectedTickets[tier.slug] || 0 },
          () => tier.name,
        ),
      ),
    [ticketTiers, selectedTickets],
  );

  useEffect(() => {
    const requiredAttendees = totalSelectedTickets;
    setAttendees((prev) => {
      if (prev.length === requiredAttendees) {
        return prev;
      }

      if (prev.length > requiredAttendees) {
        return prev.slice(0, requiredAttendees);
      }

      return [
        ...prev,
        ...Array.from(
          { length: requiredAttendees - prev.length },
          createEmptyAttendee,
        ),
      ];
    });
  }, [totalSelectedTickets]);

  function updateAttendee(index: number, data: AttendeeData) {
    setAttendees((prev) =>
      prev.map((attendee, i) => (i === index ? data : attendee)),
    );
  }

  const isBuyerValid =
    buyer.fullName.trim() !== "" && buyer.email.trim() !== "";

  const areAttendeesValid = attendees.every(
    (attendee) =>
      attendee.firstName.trim() !== "" &&
      attendee.lastName.trim() !== "" &&
      attendee.email.trim() !== "" &&
      attendee.country !== "" &&
      attendee.jobTitle.trim() !== "" &&
      attendee.companyName.trim() !== "" &&
      attendee.industry !== "" &&
      attendee.organizationRepresents.trim() !== "",
  );
  const isDetailsStepValid =
    isBuyerValid &&
    areAttendeesValid &&
    attendees.length === totalSelectedTickets;

  // Calculate totals
  const subTotal = ticketTiers.reduce(
    (sum, tier) => sum + Number(tier.price) * (selectedTickets[tier.slug] || 0),
    0,
  );
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

  // Handle discount code application
  const handleApplyDiscount = useCallback(async () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      return;
    }

    setIsApplyingDiscount(true);
    setDiscountError(null);

    try {
      const result = await validateDiscountCode(discountCode, selectedSlugs);
      if (result.valid && result.discount) {
        setAppliedDiscount({
          code: result.discount.code,
          discountType: result.discount.discountType,
          discountValue: result.discount.discountValue,
          description: result.discount.description,
        });
        setDiscountError(null);
      } else {
        setDiscountError(result.error || "Invalid discount code");
      }
    } catch {
      setDiscountError("Failed to validate discount code");
    } finally {
      setIsApplyingDiscount(false);
    }
  }, [discountCode, selectedSlugs]);

  // Handle proceed to next step
  const handleProceed = useCallback(async () => {
    setOrderError(null);

    if (currentStep === 0 && hasSelection) {
      setCurrentStep(1);
    } else if (currentStep === 1 && isDetailsStepValid) {
      // Create order when proceeding to payment
      setIsProceedLoading(true);
      try {
        const createOrderPayload = {
          selectedTickets,
          buyer,
          attendees: attendees.map((item) => ({
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            country: item.country,
            jobTitle: item.jobTitle,
            companyName: item.companyName,
            companyUrl: item.companyUrl || undefined,
            workAddress: item.workAddress || undefined,
            workPhone: item.workPhone || undefined,
            emergencyContact: item.emergencyContact || undefined,
            githubHandle: item.githubHandle || undefined,
            industry: item.industry,
            primaryRole: item.primaryRole || undefined,
            organizationRepresents: item.organizationRepresents,
            organizationType: item.organizationType || undefined,
            firstTimeKcd:
              item.firstTimeKcd === "yes"
                ? true
                : item.firstTimeKcd === "no"
                  ? false
                  : undefined,
            shirtSize: item.shirtSize || undefined,
            dietaryNeeds: item.dietaryNeeds || undefined,
            disabilityAccommodation:
              item.disabilityAccommodation === "yes"
                ? true
                : item.disabilityAccommodation === "no"
                  ? false
                  : undefined,
            personOfColor: item.personOfColor || undefined,
            genderIdentity: item.genderIdentity || undefined,
            ageRange: item.ageRange || undefined,
            cncfConsent: item.cncfConsent,
            sponsorCommunicationsOptIn: item.sponsorCommunicationsOptIn,
          })),
          discountCode: appliedDiscount?.code,
        };
        const result = await createOrder(createOrderPayload);

        if (result.success && result.orderId) {
          setOrderId(result.orderId);
          setCurrentStep(2);
        } else {
          setOrderError(result.error || "Failed to create order");
        }
      } catch {
        setOrderError("An error occurred while creating your order");
      } finally {
        setIsProceedLoading(false);
      }
    }
  }, [
    currentStep,
    hasSelection,
    isDetailsStepValid,
    selectedTickets,
    attendees,
    buyer,
    appliedDiscount,
  ]);

  // Handle payment redirect
  const handlePay = useCallback(async () => {
    if (!orderId) return;

    setIsPayLoading(true);
    setOrderError(null);
    try {
      const payment = await createPaymentUrl(orderId);
      if (!payment.success || !payment.url) {
        const message =
          payment.error || "Failed to initialize payment. Please try again.";
        setOrderError(message);
        window.alert("We could not start payment. Please try again.");
        return;
      }

      // Update order status to awaiting payment
      const statusResult = await updateOrderToAwaitingPayment(orderId);
      if (!statusResult.success) {
        const message =
          statusResult.error ||
          "Failed to initialize payment. Please try again.";
        setOrderError(message);
        window.alert("We could not start payment. Please try again.");
        return;
      }

      // Redirect user to payment provider URL
      window.location.assign(payment.url);
    } catch {
      setOrderError("Failed to initiate payment. Please try again.");
      window.alert("We could not start payment. Please try again.");
    } finally {
      setIsPayLoading(false);
    }
  }, [orderId]);

  const proceedLabel =
    currentStep === 0 ? "Proceed" : currentStep === 1 ? "Checkout" : "Pay Now";

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
              aria-label="Back to event page"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {"KCD Panama 2026"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {
                  "Apr 21st, 2026 at 8:00 AM (GMT-5) to Apr 23rd, 2026 at 6:00 PM (GMT-5)"
                }
              </p>
            </div>
          </div>

          {/* Session Timer */}
          {timer.started && (
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
                timer.minutes < 2
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>
                {"Time Left: "}
                {timer.minutes}
                {":"}
                {String(timer.seconds).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Order Error Alert */}
        {orderError && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {orderError}
          </div>
        )}

        <div className="flex gap-6 lg:gap-10">
          {/* Left: Step Indicator */}
          <div className="hidden shrink-0 md:block">
            <StepSidebar currentStep={currentStep} />
          </div>

          {/* Center: Main Content */}
          <div className="min-w-0 flex-1">
            {/* Mobile Step Indicator */}
            <div className="mb-6 flex items-center justify-center gap-4 md:hidden">
              {STEPS.map((step, index) => {
                const isActive = index === currentStep;
                const isPast = index < currentStep;
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : isPast
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {isPast ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`h-0.5 w-6 ${isPast ? "bg-primary" : "bg-border"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step: Pick Tickets */}
            {currentStep === 0 && (
              <div className="flex flex-col gap-6">
                {ticketTiers.map((tier) => (
                  <TicketCard
                    key={tier.slug}
                    tier={tier}
                    quantity={selectedTickets[tier.slug] || 0}
                    onIncrease={() => updateTicketQuantity(tier.slug, 1)}
                    onDecrease={() => updateTicketQuantity(tier.slug, -1)}
                    canIncrease={totalSelectedTickets < MAX_TICKETS_PER_BUYER}
                  />
                ))}
                <p className="text-sm text-muted-foreground">
                  {"A buyer can purchase up to "}
                  {MAX_TICKETS_PER_BUYER}
                  {" tickets in one order."}
                </p>
              </div>
            )}

            {/* Step: Attendee Details */}
            {currentStep === 1 && (
              <AttendeeDetailsStep
                buyer={buyer}
                onBuyerChange={setBuyer}
                attendees={attendees}
                onAttendeeChange={updateAttendee}
                ticketLabels={selectedTicketLabels}
              />
            )}

            {/* Step: Payment */}
            {currentStep === 2 && (
              <PaymentStep
                onBack={() => setCurrentStep(1)}
                total={total}
                orderId={orderId}
                onPay={handlePay}
                isPayLoading={isPayLoading}
              />
            )}
          </div>

          {/* Right: Cart Sidebar */}
          <div className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-8">
              <CartSidebar
                ticketTiers={ticketTiers}
                selectedTickets={selectedTickets}
                discountCode={discountCode}
                onDiscountCodeChange={setDiscountCode}
                onApplyDiscount={handleApplyDiscount}
                onProceed={currentStep === 2 ? handlePay : handleProceed}
                proceedLabel={proceedLabel}
                appliedDiscount={appliedDiscount}
                discountError={discountError}
                isApplyingDiscount={isApplyingDiscount}
                isProceedLoading={isProceedLoading || isPayLoading}
                isProceedDisabled={
                  currentStep === 1 ? !isDetailsStepValid : false
                }
              />
            </div>
          </div>
        </div>

        {/* Mobile Cart Sticky Footer */}
        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card p-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              {hasSelection ? (
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatUSD(total)}
                  </p>
                  {currentStep >= 1 && (
                    <p className="text-xs text-muted-foreground">
                      {"+ processing fee"}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {"No tickets selected"}
                </p>
              )}
            </div>
            {currentStep === 2 ? (
              <Button size="sm" onClick={handlePay} disabled={isPayLoading}>
                {isPayLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Pay Now"
                )}
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={
                  (currentStep === 0 ? !hasSelection : !isDetailsStepValid) ||
                  isProceedLoading
                }
                onClick={handleProceed}
              >
                {isProceedLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : currentStep === 0 ? (
                  "Proceed"
                ) : (
                  "Checkout"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border py-6 text-center"></div>
    </div>
  );
}
