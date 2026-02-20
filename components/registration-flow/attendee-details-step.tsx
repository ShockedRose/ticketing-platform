"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, INDUSTRIES, ORG_TYPES } from "./constants";
import type { AttendeeData, BuyerData } from "./types";

interface AttendeeDetailsStepProps {
  buyer: BuyerData;
  onBuyerChange: (data: BuyerData) => void;
  attendees: AttendeeData[];
  onAttendeeChange: (index: number, data: AttendeeData) => void;
  ticketLabels: string[];
}

export function AttendeeDetailsStep({
  buyer,
  onBuyerChange,
  attendees,
  onAttendeeChange,
  ticketLabels,
}: AttendeeDetailsStepProps) {
  function updateBuyer(field: keyof BuyerData, value: string) {
    onBuyerChange({ ...buyer, [field]: value });
  }

  const [expandedAttendees, setExpandedAttendees] = useState<number[]>(() =>
    attendees.length > 0 ? [0] : [],
  );

  useEffect(() => {
    setExpandedAttendees((prev) => {
      const validIndexes = prev.filter((i) => i < attendees.length);
      if (attendees.length === 0) return [];
      if (validIndexes.length > 0) return validIndexes;
      return [0];
    });
  }, [attendees.length]);

  function toggleAttendee(index: number) {
    setExpandedAttendees((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-bold text-foreground">{"Buyer Details"}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {"Invoice/receipt and order communication will use this information."}
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="buyer-full-name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              {"Full Name*"}
            </label>
            <Input
              id="buyer-full-name"
              value={buyer.fullName}
              onChange={(e) => updateBuyer("fullName", e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="buyer-email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              {"Email Address*"}
            </label>
            <Input
              id="buyer-email"
              type="email"
              value={buyer.email}
              onChange={(e) => updateBuyer("email", e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="buyer-phone"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              {"Phone (Optional)"}
            </label>
            <Input
              id="buyer-phone"
              value={buyer.phone}
              onChange={(e) => updateBuyer("phone", e.target.value)}
            />
          </div>
        </div>
      </div>

      {attendees.map((attendee, index) => {
        const attendeeNumber = index + 1;
        const ticketLabel = ticketLabels[index] ?? `Ticket ${attendeeNumber}`;
        const isExpanded = expandedAttendees.includes(index);

        function updateAttendee(
          field: keyof AttendeeData,
          value: string | boolean,
        ) {
          onAttendeeChange(index, { ...attendee, [field]: value });
        }

        return (
          <div
            key={`${ticketLabel}-${attendeeNumber}`}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {ticketLabel}
                {" ("}
                {attendeeNumber}
                {" of "}
                {attendees.length}
                {")"}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => toggleAttendee(index)}
                aria-expanded={isExpanded}
                aria-label={
                  isExpanded
                    ? "Collapse attendee details"
                    : "Expand attendee details"
                }
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {isExpanded && (
              <div className="mt-6 flex flex-col gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`att-first-name-${index}`}
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      {"First Name*"}
                    </label>
                    <Input
                      id={`att-first-name-${index}`}
                      value={attendee.firstName}
                      onChange={(e) =>
                        updateAttendee("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`att-last-name-${index}`}
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      {"Last Name*"}
                    </label>
                    <Input
                      id={`att-last-name-${index}`}
                      value={attendee.lastName}
                      onChange={(e) =>
                        updateAttendee("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`att-email-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Email Address*"}
                  </label>
                  <Input
                    id={`att-email-${index}`}
                    type="email"
                    value={attendee.email}
                    onChange={(e) => updateAttendee("email", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {"Country*"}
                  </label>
                  <Select
                    value={attendee.country}
                    onValueChange={(v) => updateAttendee("country", v)}
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor={`att-job-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Job Title*"}
                  </label>
                  <Input
                    id={`att-job-${index}`}
                    value={attendee.jobTitle}
                    onChange={(e) => updateAttendee("jobTitle", e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`att-company-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Current Company/Organization/University*"}
                  </label>
                  <Input
                    id={`att-company-${index}`}
                    value={attendee.companyName}
                    onChange={(e) =>
                      updateAttendee("companyName", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor={`att-company-url-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Company URL"}
                  </label>
                  <Input
                    id={`att-company-url-${index}`}
                    value={attendee.companyUrl}
                    onChange={(e) =>
                      updateAttendee("companyUrl", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor={`att-work-address-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Work Address"}
                  </label>
                  <Input
                    id={`att-work-address-${index}`}
                    value={attendee.workAddress}
                    onChange={(e) =>
                      updateAttendee("workAddress", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor={`att-work-phone-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Work Phone"}
                  </label>
                  <Input
                    id={`att-work-phone-${index}`}
                    value={attendee.workPhone}
                    onChange={(e) =>
                      updateAttendee("workPhone", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor={`att-emergency-contact-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Emergency Contact"}
                  </label>
                  <Input
                    id={`att-emergency-contact-${index}`}
                    value={attendee.emergencyContact}
                    onChange={(e) =>
                      updateAttendee("emergencyContact", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor={`att-github-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"GitHub Handle"}
                  </label>
                  <Input
                    id={`att-github-${index}`}
                    value={attendee.githubHandle}
                    onChange={(e) =>
                      updateAttendee("githubHandle", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {"Industry*"}
                  </label>
                  <Select
                    value={attendee.industry}
                    onValueChange={(v) => updateAttendee("industry", v)}
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((i) => (
                        <SelectItem key={i} value={i}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor={`att-org-represents-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Organization Represents*"}
                  </label>
                  <Input
                    id={`att-org-represents-${index}`}
                    value={attendee.organizationRepresents}
                    onChange={(e) =>
                      updateAttendee("organizationRepresents", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {"I represent an organization that:"}
                  </label>
                  <Select
                    value={attendee.organizationType}
                    onValueChange={(v) => updateAttendee("organizationType", v)}
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORG_TYPES.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor={`att-primary-role-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Primary Role"}
                  </label>
                  <Input
                    id={`att-primary-role-${index}`}
                    value={attendee.primaryRole}
                    onChange={(e) =>
                      updateAttendee("primaryRole", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {"Is this your first KCD?"}
                  </label>
                  <Select
                    value={attendee.firstTimeKcd}
                    onValueChange={(v) => updateAttendee("firstTimeKcd", v)}
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="skip">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor={`att-shirt-size-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Shirt Size"}
                  </label>
                  <Input
                    id={`att-shirt-size-${index}`}
                    value={attendee.shirtSize}
                    onChange={(e) =>
                      updateAttendee("shirtSize", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor={`att-dietary-needs-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Dietary Needs"}
                  </label>
                  <Input
                    id={`att-dietary-needs-${index}`}
                    value={attendee.dietaryNeeds}
                    onChange={(e) =>
                      updateAttendee("dietaryNeeds", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {"Disability Accommodation Needed?"}
                  </label>
                  <Select
                    value={attendee.disabilityAccommodation}
                    onValueChange={(v) =>
                      updateAttendee("disabilityAccommodation", v)
                    }
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="skip">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor={`att-person-of-color-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Person of Color"}
                  </label>
                  <Input
                    id={`att-person-of-color-${index}`}
                    value={attendee.personOfColor}
                    onChange={(e) =>
                      updateAttendee("personOfColor", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor={`att-gender-identity-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Gender Identity"}
                  </label>
                  <Input
                    id={`att-gender-identity-${index}`}
                    value={attendee.genderIdentity}
                    onChange={(e) =>
                      updateAttendee("genderIdentity", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor={`att-age-range-${index}`}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {"Age Range"}
                  </label>
                  <Input
                    id={`att-age-range-${index}`}
                    value={attendee.ageRange}
                    onChange={(e) => updateAttendee("ageRange", e.target.value)}
                  />
                </div>

                <div className="border-t border-border" />

                <div className="flex gap-3">
                  <Checkbox
                    id={`cncf-consent-${index}`}
                    checked={attendee.cncfConsent}
                    onCheckedChange={(c) => updateAttendee("cncfConsent", !!c)}
                    className="mt-0.5 shrink-0"
                  />
                  <label
                    htmlFor={`cncf-consent-${index}`}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="font-semibold text-foreground">
                      {"CNCF Communications"}
                    </span>
                    <br />
                    {
                      "In addition, if you check the check box to the left of this text, you further authorize KCD NAME and the Cloud Native Computing Foundation to contact you via email regarding other events and open source projects from time to time. You can unsubscribe from these additional email communications at any time by following the 'unsubscribe' instructions included within such communications or by sending an unsubscribe request to privacy@linuxfoundation.org."
                    }
                    <br />
                    {
                      "By submitting this registration you consent to The Cloud Native Computing Foundation's communication with you with respect to the event or services to which this registration pertains.*"
                    }
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`sponsor-opt-in-${index}`}
                    checked={attendee.sponsorCommunicationsOptIn}
                    onCheckedChange={(c) =>
                      updateAttendee("sponsorCommunicationsOptIn", !!c)
                    }
                  />
                  <label
                    htmlFor={`sponsor-opt-in-${index}`}
                    className="text-sm text-muted-foreground"
                  >
                    {
                      "I would like to receive ticket and event updates over WhatsApp"
                    }
                  </label>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
