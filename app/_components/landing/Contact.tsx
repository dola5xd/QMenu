import ContactForm from "@/_components/ui/ContactForm";

type ContactProps = {
  contactText: {
    heading: string;
    description: string;
  };
};

function Contact({ contactText }: ContactProps) {
  return (
    <section
      className="px-6 sm:px-12 py-20 sm:py-32 md:px-20 bg-background text-primary"
      id="contact"
    >
      <div className="max-w-4xl mx-auto mb-12 space-y-4 text-center">
        <h2 className="text-4xl font-bold">{contactText.heading}</h2>
        <p>{contactText.description}</p>
      </div>
      <ContactForm />
    </section>
  );
}

export default Contact;
