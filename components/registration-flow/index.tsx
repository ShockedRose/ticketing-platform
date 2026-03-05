"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Check, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  createOrder,
  createPaymentUrl,
  processZeroTotalOrder,
  redeemOrderDiscount,
  updateOrderToAwaitingPayment,
} from "@/lib/actions/order.actions";
import { AttendeeDetailsStep } from "./attendee-details-step";
import { CartSidebar } from "./cart-sidebar";
import { MAX_TICKETS_PER_BUYER, STEPS } from "./constants";
import { PaymentStep } from "./payment-step";
import { StepSidebar } from "./step-sidebar";
import { TicketCard } from "./ticket-card";
import type {
  AttendeeData,
  BuyerData,
  DiscountInfo,
  SelectedTickets,
  TicketTierUI,
} from "./types";
import { useSessionTimer } from "./use-session-timer";
import { formatUSD } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface RegistrationFlowProps {
  lang: Locale;
  dictionary: Dictionary["registration"];
  ticketTiers: TicketTierUI[];
  attendeInitialData: AttendeeData;
}

function createEmptyAttendee(attendeInitialData: AttendeeData): AttendeeData {
  return structuredClone(attendeInitialData);
}

export function RegistrationFlow({
  lang,
  dictionary,
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
  const [isProcessOrderLoading, setIsProcessOrderLoading] = useState(false);
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
        ...Array.from({ length: requiredAttendees - prev.length }, () =>
          createEmptyAttendee(attendeInitialData),
        ),
      ];
    });
  }, [totalSelectedTickets, attendeInitialData]);

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

  const handleApplyDiscount = useCallback(async () => {
    if (currentStep !== 2 || !orderId) {
      setDiscountError(dictionary.errors.discountOnlyInPayment);
      return;
    }

    if (appliedDiscount) {
      return;
    }

    if (!discountCode.trim()) {
      setDiscountError(dictionary.errors.discountCodeRequired);
      return;
    }

    setIsApplyingDiscount(true);
    setDiscountError(null);

    try {
      const result = await redeemOrderDiscount(orderId, discountCode);
      if (result.success && result.discount) {
        setAppliedDiscount({
          code: result.discount.code,
          discountType: result.discount.discountType,
          discountValue: result.discount.discountValue,
          description: null,
        });
        setDiscountError(null);
      } else {
        setDiscountError(result.error || dictionary.errors.invalidDiscountCode);
      }
    } catch {
      setDiscountError(dictionary.errors.validateDiscountFailed);
    } finally {
      setIsApplyingDiscount(false);
    }
  }, [currentStep, orderId, appliedDiscount, discountCode, dictionary.errors]);

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
        };
        const result = await createOrder(createOrderPayload);

        if (result.success && result.orderId) {
          setAppliedDiscount(null);
          setDiscountError(null);
          setOrderId(result.orderId);
          setCurrentStep(2);
        } else {
          setOrderError(result.error || dictionary.errors.createOrderFailed);
        }
      } catch {
        setOrderError(dictionary.errors.createOrderUnexpected);
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
    dictionary.errors.createOrderFailed,
    dictionary.errors.createOrderUnexpected,
  ]);

  // Handle payment redirect
  const handlePay = useCallback(async () => {
    if (!orderId) return;

    setIsPayLoading(true);
    setOrderError(null);
    try {
      const payment = await createPaymentUrl(orderId);
      if (!payment.success || !payment.url) {
        const message = payment.error || dictionary.errors.initPaymentFailed;
        setOrderError(message);
        window.alert(dictionary.errors.initPaymentAlert);
        return;
      }

      // Update order status to awaiting payment
      const statusResult = await updateOrderToAwaitingPayment(orderId);
      if (!statusResult.success) {
        const message =
          statusResult.error || dictionary.errors.initPaymentFailed;
        setOrderError(message);
        window.alert(dictionary.errors.initPaymentAlert);
        return;
      }

      // Redirect user to payment provider URL
      window.location.assign(payment.url);
    } catch {
      setOrderError(dictionary.errors.initPaymentUnexpected);
      window.alert(dictionary.errors.initPaymentAlert);
    } finally {
      setIsPayLoading(false);
    }
  }, [orderId, dictionary.errors]);

  const handleProcessOrder = useCallback(async () => {
    if (!orderId) return;

    setIsProcessOrderLoading(true);
    setOrderError(null);
    try {
      const result = await processZeroTotalOrder(orderId);
      if (!result.success) {
        setOrderError(result.error || dictionary.errors.processOrderFailed);
        window.alert(dictionary.errors.processOrderAlert);
        return;
      }

      window.location.assign(`/${lang}/payments/status?success=true`);
    } catch {
      setOrderError(dictionary.errors.processOrderFailed);
      window.alert(dictionary.errors.processOrderAlert);
    } finally {
      setIsProcessOrderLoading(false);
    }
  }, [orderId, lang, dictionary.errors]);

  const canProcessWithoutPayment = total <= 0;

  const proceedLabel =
    currentStep === 0
      ? dictionary.proceed.proceed
      : currentStep === 1
        ? dictionary.proceed.checkout
        : canProcessWithoutPayment
          ? dictionary.proceed.processOrder
          : dictionary.proceed.payNow;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href={`/${lang}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              aria-label={dictionary.header.backToEventAria}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {dictionary.header.eventTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                {dictionary.header.eventDateRange}
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
                {dictionary.header.timeLeftLabel}
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
            <StepSidebar
              currentStep={currentStep}
              labels={dictionary.steps.labels}
            />
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
                    dictionary={dictionary.ticketCard}
                    tier={tier}
                    quantity={selectedTickets[tier.slug] || 0}
                    onIncrease={() => updateTicketQuantity(tier.slug, 1)}
                    onDecrease={() => updateTicketQuantity(tier.slug, -1)}
                    canIncrease={totalSelectedTickets < MAX_TICKETS_PER_BUYER}
                  />
                ))}
                <p className="text-sm text-muted-foreground">
                  {dictionary.steps.maxTicketsPrefix}
                  {MAX_TICKETS_PER_BUYER}
                  {dictionary.steps.maxTicketsSuffix}
                </p>
              </div>
            )}

            {/* Step: Attendee Details */}
            {currentStep === 1 && (
              <AttendeeDetailsStep
                dictionary={dictionary.attendee}
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
                dictionary={dictionary.paymentStep}
                onBack={() => setCurrentStep(1)}
                total={total}
                orderId={orderId}
                onPrimaryAction={
                  canProcessWithoutPayment ? handleProcessOrder : handlePay
                }
                primaryActionLabel={proceedLabel}
                isPrimaryLoading={isPayLoading || isProcessOrderLoading}
                isZeroTotalOrder={canProcessWithoutPayment}
                showExternalLinkIcon={!canProcessWithoutPayment}
              />
            )}
          </div>

          {/* Right: Cart Sidebar */}
          <div className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-8">
              <CartSidebar
                dictionary={dictionary.cart}
                ticketTiers={ticketTiers}
                selectedTickets={selectedTickets}
                discountCode={discountCode}
                onDiscountCodeChange={setDiscountCode}
                onApplyDiscount={handleApplyDiscount}
                onProceed={
                  currentStep === 2
                    ? canProcessWithoutPayment
                      ? handleProcessOrder
                      : handlePay
                    : handleProceed
                }
                proceedLabel={proceedLabel}
                appliedDiscount={appliedDiscount}
                discountError={discountError}
                isApplyingDiscount={isApplyingDiscount}
                isProceedLoading={
                  isProceedLoading || isPayLoading || isProcessOrderLoading
                }
                showDiscountSection={currentStep === 2}
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
                      {dictionary.mobileBar.processingFee}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {dictionary.mobileBar.noTicketsSelected}
                </p>
              )}
            </div>
            {currentStep === 2 ? (
              <Button
                size="sm"
                onClick={canProcessWithoutPayment ? handleProcessOrder : handlePay}
                disabled={isPayLoading || isProcessOrderLoading}
              >
                {isPayLoading || isProcessOrderLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  proceedLabel
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
                  dictionary.proceed.proceed
                ) : (
                  dictionary.proceed.checkout
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
