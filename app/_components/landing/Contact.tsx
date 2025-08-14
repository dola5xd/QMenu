import ContactForm from "@/_components/ui/ContactForm";

function Contact() {
  return (
    <section
      className="px-6 sm:px-12 py-20 sm:py-32 md:px-20 bg-background text-primary"
      id="contact"
    >
      <div className="max-w-4xl mx-auto mb-12 space-y-4 text-center">
        <h2 className="text-4xl font-bold">Contact Us</h2>
        <p>
          Have questions? Fill out the form below and we’ll get back to you
          shortly.
        </p>
      </div>
      <ContactForm />
    </section>
  );
}

export default Contact;
