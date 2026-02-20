import { RegistrationFlow } from "@/components/registration-flow";
import { getTicketTiers } from "@/lib/actions/ticket.actions";
import { environment } from "@/lib/constants/environment";

export default async function RegisterPage() {
  const ticketTypes = await getTicketTiers();

  return <RegistrationFlow ticketTiers={ticketTypes} attendeInitialData={environment.ATTENDEE_FORM_FIELDS} />;
}
