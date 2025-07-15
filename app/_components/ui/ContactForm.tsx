"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log(data);
    // Optionally send to backend/email service
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl w-full mx-auto"
    >
      <div>
        <label className="block mb-1 font-medium ">Name</label>
        <input
          type="text"
          {...register("name")}
          className="w-full p-3 border border-primary/75 focus:border-primary rounded-lg bg-background text-primary"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium ">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full p-3 border border-primary/75 focus:border-primary rounded-lg bg-background text-primary"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium ">Message</label>
        <textarea
          rows={5}
          {...register("message")}
          className="w-full p-3 border border-primary/75 focus:border-primary rounded-lg bg-background text-primary resize-none"
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition font-semibold"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {isSubmitSuccessful && (
        <p className="text-green-500 text-sm mt-3">
          Message sent successfully!
        </p>
      )}
    </form>
  );
}

export default ContactForm;
