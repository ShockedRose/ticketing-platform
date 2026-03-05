import "server-only";

import type { Locale } from "@/lib/i18n/config";

const dictionaries = {
  en: {
    navbar: {
      links: [
        { label: "About", href: "#about" },
        // { label: "Speakers", href: "#speakers" },
        // { label: "Schedule", href: "#schedule" },
        // { label: "Sponsors", href: "#sponsors" },
      ],
      toggleMenuAriaLabel: "Toggle menu",
      languageLabel: "Language",
      languageOptions: {
        en: "English",
        es: "Spanish",
      },
    },
    hero: {
      imageAlt: "KCD Panama 2026 conference venue with attendees",
      inPersonBadge: "In-Person Event",
      cloudNativeBadge: "Cloud Native",
      title: "Kubernetes Community Days Panama 2026",
      date: "Apr 21-23, 2026",
      location: "Ciudad del Saber, Panama City",
    },
    about: {
      title: "About the Event",
      paragraphOne:
        "Kubernetes Community Days (KCD) Panama 2026 brings together cloud-native enthusiasts, developers, DevOps engineers, and IT leaders from across the region for 3 days of learning, networking, and collaboration. This community-driven event is part of the global KCD initiative supported by the Cloud Native Computing Foundation (CNCF).",
      paragraphTwo:
        "Whether you are new to cloud-native technologies or a seasoned Kubernetes practitioner, KCD Panama offers something for everyone. From hands-on workshops and deep-dive talks to lightning sessions and hallway conversations, this is your chance to connect with the vibrant cloud-native community.",
    },
    speakers: {
      title: "Speakers",
      items: [
        {
          name: "Miguel Gonzalez",
          title: "Sr. Platform Engineer",
          company: "Google Cloud",
          initials: "MG",
        },
        {
          name: "Jesús Rodriguez",
          title: "DevOps Lead",
          company: "Razorpay",
          initials: "JR",
        },
        {
          name: "Gabriel Dabila",
          title: "Cloud Architect",
          company: "Microsoft",
          initials: "GD",
        },
        {
          name: "José Marín",
          title: "SRE Manager",
          company: "Flipkart",
          initials: "JM",
        },
      ],
    },
    schedule: {
      title: "Schedule",
      keynoteTag: "Keynote",
      items: [
        {
          time: "08:30 AM",
          title: "Registration & Breakfast",
          speaker: null,
          type: "break",
        },
        {
          time: "09:00 AM",
          title: "Opening Keynote: The State of Cloud Native in Panama",
          speaker: "Priya Sharma",
          type: "keynote",
        },
        {
          time: "09:45 AM",
          title: "Building Resilient Microservices with Kubernetes",
          speaker: "Rahul Mehta",
          type: "talk",
        },
        {
          time: "10:30 AM",
          title: "Coffee Break & Networking",
          speaker: null,
          type: "break",
        },
        {
          time: "11:00 AM",
          title: "Securing Your Kubernetes Clusters: Best Practices",
          speaker: "Ananya Gupta",
          type: "talk",
        },
        {
          time: "11:45 AM",
          title: "Observability at Scale with OpenTelemetry",
          speaker: "Vikram Singh",
          type: "talk",
        },
        {
          time: "12:30 PM",
          title: "Lunch Break",
          speaker: null,
          type: "break",
        },
        {
          time: "01:30 PM",
          title: "GitOps and the Future of Continuous Delivery",
          speaker: "Neha Kapoor",
          type: "talk",
        },
        {
          time: "02:15 PM",
          title: "Contributing to Kubernetes: A Beginner's Guide",
          speaker: "Arjun Patel",
          type: "talk",
        },
        {
          time: "03:00 PM",
          title: "Lightning Talks",
          speaker: "Community",
          type: "talk",
        },
        {
          time: "03:45 PM",
          title: "Panel Discussion: Cloud Native Careers",
          speaker: "All Speakers",
          type: "keynote",
        },
        {
          time: "04:30 PM",
          title: "Closing Remarks & Swag Giveaway",
          speaker: null,
          type: "break",
        },
      ],
    },
    sponsors: {
      title: "Sponsors",
      platinumTitle: "Platinum Sponsors",
      goldTitle: "Gold Sponsors",
      silverTitle: "Silver Sponsors",
      ctaTitle: "Interested in sponsoring?",
      ctaBodyPrefix: "Reach out to us at",
      ctaBodySuffix: "to learn about our packages.",
    },
    ticketWidget: {
      title: "Secure Your Spot",
      description: "Join the cloud native community in Panama.",
      countdownLabels: {
        days: "Days",
        hours: "Hours",
        mins: "Mins",
      },
      features: [
        "Full 3-day conference access",
        "Workshops & Lightning Talks",
        "Networking Events",
        "Swag Bag & T-Shirt",
        "Lunch & Coffee Breaks",
      ],
      registerNow: "Register Now",
      limitedTickets: "Limited tickets available for this batch.",
    },
    helpCard: {
      title: "Need help?",
      bodyPrefix: "Contact us at",
      bodySuffix: "for any questions about tickets or sponsorship.",
    },
    footer: {
      communityText:
        "A community supported by the Cloud Native Computing Foundation.",
      links: [
        {
          label: "KCD",
          href: "https://www.cncf.io/kcds",
        },
        {
          label: "Code of Conduct",
          href: "https://events.linuxfoundation.org/about/code-of-conduct",
        },
        {
          label: "Contact",
          href: "https://community.cncf.io/cloud-native-panama",
        },
        { label: "CNCF", href: "https://www.cncf.io" },
      ],
      rightsReserved: "All rights reserved.",
    },
    registration: {
      errors: {
        discountCodeRequired: "Please enter a discount code",
        discountOnlyInPayment: "Discount codes can only be applied during payment",
        invalidDiscountCode: "Invalid discount code",
        validateDiscountFailed: "Failed to validate discount code",
        createOrderFailed: "Failed to create order",
        createOrderUnexpected: "An error occurred while creating your order",
        initPaymentFailed: "Failed to initialize payment. Please try again.",
        initPaymentUnexpected: "Failed to initiate payment. Please try again.",
        initPaymentAlert: "We could not start payment. Please try again.",
        processOrderFailed: "Failed to process this order. Please try again.",
        processOrderAlert: "We could not process your order. Please try again.",
      },
      proceed: {
        proceed: "Proceed",
        checkout: "Checkout",
        payNow: "Pay Now",
        processOrder: "Process Order",
      },
      header: {
        backToEventAria: "Back to event page",
        eventTitle: "KCD Panama 2026",
        eventDateRange:
          "Apr 21st, 2026 at 8:00 AM (GMT-5) to Apr 23rd, 2026 at 6:00 PM (GMT-5)",
        timeLeftLabel: "Time Left: ",
      },
      steps: {
        labels: ["Pick Tickets", "Attendee Details", "Payment"],
        maxTicketsPrefix: "A buyer can purchase up to ",
        maxTicketsSuffix: " tickets in one order.",
      },
      mobileBar: {
        processingFee: "+ processing fee",
        noTicketsSelected: "No tickets selected",
      },
      ticketCard: {
        useCouponCode: "USE Coupon Code: ",
        includes: "Your ticket includes:",
        roadmapNotice:
          "Check the website for the latest updates; the roadmap may change, as always.",
        soldOut: "Sold Out",
        comingSoon: "Coming Soon",
      },
      cart: {
        summaryTitle: "Ticket Summary",
        subTotal: "Sub Total",
        discountLabel: "Discount",
        total: "Total",
        processingFeeNote:
          "Processing Fee will be added on selecting payment method*",
        emptySelection:
          "You haven't selected any ticket. Select a ticket to see the ticket summary.",
        applyDiscountTitle: "Apply Discount Code",
        enterCodePlaceholder: "Enter Code",
        apply: "Apply",
        discountAppliedPrefix: "Discount applied: ",
      },
      attendee: {
        buyerDetailsTitle: "Buyer Details",
        buyerDetailsDescription:
          "Invoice/receipt and order communication will use this information.",
        fullName: "Full Name*",
        email: "Email Address*",
        phoneOptional: "Phone (Optional)",
        ticketLabelFallback: "Ticket",
        attendeeOfSeparator: " of ",
        collapseAttendee: "Collapse attendee details",
        expandAttendee: "Expand attendee details",
        firstName: "First Name*",
        lastName: "Last Name*",
        country: "Country*",
        selectCountry: "Select a country",
        jobTitle: "Job Title*",
        company: "Current Company/Organization/University*",
        companyUrl: "Company URL",
        workAddress: "Work Address",
        workPhone: "Work Phone",
        emergencyContact: "Emergency Contact",
        githubHandle: "GitHub Handle",
        industry: "Industry*",
        select: "Select",
        organizationRepresents: "Organization Represents*",
        organizationType: "I represent an organization that:",
        primaryRole: "Primary Role",
        firstKcd: "Is this your first KCD?",
        yes: "Yes",
        no: "No",
        preferNotToSay: "Prefer not to say",
        shirtSize: "Shirt Size",
        dietaryNeeds: "Dietary Needs",
        disabilityAccommodation: "Disability Accommodation Needed?",
        personOfColor: "Person of Color",
        genderIdentity: "Gender Identity",
        ageRange: "Age Range",
        cncfCommunicationsTitle: "CNCF Communications",
        cncfCommunicationsBodyOne:
          "In addition, if you check the check box to the left of this text, you further authorize KCD NAME and the Cloud Native Computing Foundation to contact you via email regarding other events and open source projects from time to time. You can unsubscribe from these additional email communications at any time by following the 'unsubscribe' instructions included within such communications or by sending an unsubscribe request to privacy@linuxfoundation.org.",
        cncfCommunicationsBodyTwo:
          "By submitting this registration you consent to The Cloud Native Computing Foundation's communication with you with respect to the event or services to which this registration pertains.*",
        whatsappOptIn:
          "I would like to receive ticket and event updates over WhatsApp",
      },
      paymentStep: {
        title: "Complete Your Payment",
        descriptionPrefix:
          "You will be redirected to PagueloFacil's secure checkout to complete your payment of ",
        zeroTotalDescriptionPrefix:
          "Your order total is ",
        orderIdPrefix: "Order ID: ",
        payWithProvider: "Pay with PagueloFacil",
        back: "Back",
      },
    },
    payments: {
      status: {
        successTitle: "Payment Successful!",
        failureTitle: "Payment Failed",
        successMessage: "Your payment was processed successfully.",
        failureMessage: "We couldn't complete your payment. Please try again.",
        returnHome: "Return to Home",
      },
    },
  },
  es: {
    navbar: {
      links: [
        { label: "Acerca de", href: "#about" },
        // { label: "Ponentes", href: "#speakers" },
        // { label: "Agenda", href: "#schedule" },
        // { label: "Patrocinadores", href: "#sponsors" },
      ],
      toggleMenuAriaLabel: "Mostrar menú",
      languageLabel: "Idioma",
      languageOptions: {
        en: "Inglés",
        es: "Español",
      },
    },
    hero: {
      imageAlt: "Sede de KCD Panama 2026 con asistentes",
      inPersonBadge: "Evento Presencial",
      cloudNativeBadge: "Cloud Native",
      title: "Kubernetes Community Days Panama 2026",
      date: "21-23 de abril de 2026",
      location: "Ciudad del Saber, Ciudad de Panamá",
    },
    about: {
      title: "Sobre el Evento",
      paragraphOne:
        "Kubernetes Community Days (KCD) Panama 2026 reúne a entusiastas cloud-native, desarrolladores, ingenieros DevOps y líderes de TI de toda la región durante 3 días de aprendizaje, networking y colaboración. Este evento impulsado por la comunidad forma parte de la iniciativa global KCD respaldada por la Cloud Native Computing Foundation (CNCF).",
      paragraphTwo:
        "Ya seas nuevo en tecnologías cloud-native o un practicante experimentado de Kubernetes, KCD Panama tiene algo para todos. Desde talleres prácticos y charlas técnicas hasta sesiones relámpago y conversaciones de pasillo, esta es tu oportunidad para conectar con la vibrante comunidad cloud-native.",
    },
    speakers: {
      title: "Ponentes",
      items: [
        {
          name: "Miguel Gonzalez",
          title: "Ing. Senior de Plataforma",
          company: "Google Cloud",
          initials: "MG",
        },
        {
          name: "Jesús Rodriguez",
          title: "Líder DevOps",
          company: "Razorpay",
          initials: "JR",
        },
        {
          name: "Gabriel Dabila",
          title: "Arquitecto Cloud",
          company: "Microsoft",
          initials: "GD",
        },
        {
          name: "José Marín",
          title: "Gerente SRE",
          company: "Flipkart",
          initials: "JM",
        },
      ],
    },
    schedule: {
      title: "Agenda",
      keynoteTag: "Conferencia",
      items: [
        {
          time: "08:30 AM",
          title: "Registro y Desayuno",
          speaker: null,
          type: "break",
        },
        {
          time: "09:00 AM",
          title: "Conferencia de Apertura: El Estado de Cloud Native en Panamá",
          speaker: "Priya Sharma",
          type: "keynote",
        },
        {
          time: "09:45 AM",
          title: "Construyendo Microservicios Resilientes con Kubernetes",
          speaker: "Rahul Mehta",
          type: "talk",
        },
        {
          time: "10:30 AM",
          title: "Pausa para Café y Networking",
          speaker: null,
          type: "break",
        },
        {
          time: "11:00 AM",
          title: "Protege tus Clústeres de Kubernetes: Mejores Prácticas",
          speaker: "Ananya Gupta",
          type: "talk",
        },
        {
          time: "11:45 AM",
          title: "Observabilidad a Escala con OpenTelemetry",
          speaker: "Vikram Singh",
          type: "talk",
        },
        {
          time: "12:30 PM",
          title: "Pausa para Almuerzo",
          speaker: null,
          type: "break",
        },
        {
          time: "01:30 PM",
          title: "GitOps y el Futuro de la Entrega Continua",
          speaker: "Neha Kapoor",
          type: "talk",
        },
        {
          time: "02:15 PM",
          title: "Contribuir a Kubernetes: Guía para Principiantes",
          speaker: "Arjun Patel",
          type: "talk",
        },
        {
          time: "03:00 PM",
          title: "Charlas Relámpago",
          speaker: "Comunidad",
          type: "talk",
        },
        {
          time: "03:45 PM",
          title: "Panel: Carreras en Cloud Native",
          speaker: "Todos los Ponentes",
          type: "keynote",
        },
        {
          time: "04:30 PM",
          title: "Cierre y Entrega de Swag",
          speaker: null,
          type: "break",
        },
      ],
    },
    sponsors: {
      title: "Patrocinadores",
      platinumTitle: "Patrocinadores Platinum",
      goldTitle: "Patrocinadores Gold",
      silverTitle: "Patrocinadores Silver",
      ctaTitle: "¿Te interesa patrocinar?",
      ctaBodyPrefix: "Escríbenos a",
      ctaBodySuffix: "para conocer nuestros paquetes.",
    },
    ticketWidget: {
      title: "Asegura Tu Cupo",
      description: "Únete a la comunidad cloud native en Panamá.",
      countdownLabels: {
        days: "Días",
        hours: "Horas",
        mins: "Min",
      },
      features: [
        "Acceso completo a los 3 días de conferencia",
        "Talleres y charlas relámpago",
        "Eventos de networking",
        "Bolsa de regalos y camiseta",
        "Almuerzo y pausas de café",
      ],
      registerNow: "Regístrate Ahora",
      limitedTickets: "Entradas limitadas disponibles en esta tanda.",
    },
    helpCard: {
      title: "¿Necesitas ayuda?",
      bodyPrefix: "Contáctanos en",
      bodySuffix: "si tienes dudas sobre entradas o patrocinios.",
    },
    footer: {
      communityText:
        "Una comunidad respaldada por la Cloud Native Computing Foundation.",
      links: [
        {
          label: "KCD",
          href: "https://www.cncf.io/kcds",
        },
        {
          label: "Código de Conducta",
          href: "https://events.linuxfoundation.org/about/code-of-conduct",
        },

        {
          label: "Contacto",
          href: "https://community.cncf.io/cloud-native-panama",
        },
        { label: "CNCF", href: "https://www.cncf.io" },
      ],
      rightsReserved: "Todos los derechos reservados.",
    },
    registration: {
      errors: {
        discountCodeRequired: "Por favor ingresa un código de descuento",
        discountOnlyInPayment:
          "Los códigos de descuento solo se pueden aplicar durante el pago",
        invalidDiscountCode: "Código de descuento inválido",
        validateDiscountFailed: "No se pudo validar el código de descuento",
        createOrderFailed: "No se pudo crear la orden",
        createOrderUnexpected: "Ocurrió un error al crear tu orden",
        initPaymentFailed: "No se pudo iniciar el pago. Inténtalo de nuevo.",
        initPaymentUnexpected: "No se pudo iniciar el pago. Inténtalo de nuevo.",
        initPaymentAlert: "No pudimos iniciar el pago. Inténtalo de nuevo.",
        processOrderFailed: "No se pudo procesar la orden. Inténtalo de nuevo.",
        processOrderAlert: "No pudimos procesar la orden. Inténtalo de nuevo.",
      },
      proceed: {
        proceed: "Continuar",
        checkout: "Finalizar",
        payNow: "Pagar Ahora",
        processOrder: "Procesar Orden",
      },
      header: {
        backToEventAria: "Volver al evento",
        eventTitle: "KCD Panama 2026",
        eventDateRange:
          "21 de abril 2026 a las 8:00 AM (GMT-5) al 23 de abril 2026 a las 6:00 PM (GMT-5)",
        timeLeftLabel: "Tiempo restante: ",
      },
      steps: {
        labels: ["Entradas", "Datos del Participante", "Pago"],
        maxTicketsPrefix: "Un comprador puede adquirir hasta ",
        maxTicketsSuffix: " entradas en una sola orden.",
      },
      mobileBar: {
        processingFee: "+ cargo por procesamiento",
        noTicketsSelected: "No hay entradas seleccionadas",
      },
      ticketCard: {
        useCouponCode: "USA el código: ",
        includes: "Tu entrada incluye:",
        roadmapNotice:
          "Revisa el sitio para las últimas novedades; la agenda puede cambiar.",
        soldOut: "Agotado",
        comingSoon: "Próximamente",
      },
      cart: {
        summaryTitle: "Resumen de Entradas",
        subTotal: "Subtotal",
        discountLabel: "Descuento",
        total: "Total",
        processingFeeNote:
          "Se agregará un cargo por procesamiento al seleccionar el método de pago*",
        emptySelection:
          "No has seleccionado entradas. Elige una para ver el resumen.",
        applyDiscountTitle: "Aplicar Código de Descuento",
        enterCodePlaceholder: "Ingresa código",
        apply: "Aplicar",
        discountAppliedPrefix: "Descuento aplicado: ",
      },
      attendee: {
        buyerDetailsTitle: "Datos del Comprador",
        buyerDetailsDescription:
          "La factura/recibo y las comunicaciones de la orden usarán esta información.",
        fullName: "Nombre Completo*",
        email: "Correo Electrónico*",
        phoneOptional: "Teléfono (Opcional)",
        ticketLabelFallback: "Entrada",
        attendeeOfSeparator: " de ",
        collapseAttendee: "Contraer datos del participante",
        expandAttendee: "Expandir datos del participante",
        firstName: "Nombre*",
        lastName: "Apellido*",
        country: "País*",
        selectCountry: "Selecciona un país",
        jobTitle: "Cargo*",
        company: "Empresa/Organización/Universidad Actual*",
        companyUrl: "URL de la Empresa",
        workAddress: "Dirección de Trabajo",
        workPhone: "Teléfono de Trabajo",
        emergencyContact: "Contacto de Emergencia",
        githubHandle: "Usuario de GitHub",
        industry: "Industria*",
        select: "Selecciona",
        organizationRepresents: "Organización que Representa*",
        organizationType: "Represento una organización que:",
        primaryRole: "Rol Principal",
        firstKcd: "¿Es tu primer KCD?",
        yes: "Sí",
        no: "No",
        preferNotToSay: "Prefiero no decirlo",
        shirtSize: "Talla de Camisa",
        dietaryNeeds: "Necesidades Alimentarias",
        disabilityAccommodation: "¿Necesitas acomodación por discapacidad?",
        personOfColor: "Persona Racializada",
        genderIdentity: "Identidad de Género",
        ageRange: "Rango de Edad",
        cncfCommunicationsTitle: "Comunicaciones de CNCF",
        cncfCommunicationsBodyOne:
          "Además, si marcas esta casilla, autorizas a KCD y a la Cloud Native Computing Foundation a contactarte por correo sobre otros eventos y proyectos de código abierto. Puedes cancelar la suscripción en cualquier momento siguiendo las instrucciones de baja o escribiendo a privacy@linuxfoundation.org.",
        cncfCommunicationsBodyTwo:
          "Al enviar este registro, autorizas la comunicación de la Cloud Native Computing Foundation en relación con este evento o servicios.*",
        whatsappOptIn:
          "Me gustaría recibir novedades de entradas y del evento por WhatsApp",
      },
      paymentStep: {
        title: "Completa Tu Pago",
        descriptionPrefix:
          "Serás redirigido al checkout seguro de PagueloFacil para completar tu pago de ",
        zeroTotalDescriptionPrefix:
          "El total de tu orden es ",
        orderIdPrefix: "ID de orden: ",
        payWithProvider: "Pagar con PagueloFacil",
        back: "Volver",
      },
    },
    payments: {
      status: {
        successTitle: "¡Pago Exitoso!",
        failureTitle: "Pago Fallido",
        successMessage: "Tu pago fue procesado exitosamente.",
        failureMessage: "No pudimos completar tu pago. Inténtalo nuevamente.",
        returnHome: "Volver al Inicio",
      },
    },
  },
}

export type Dictionary = (typeof dictionaries)[Locale];

export async function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
