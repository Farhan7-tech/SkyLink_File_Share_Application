import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import {
  Send,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { apiEndpoints } from "../util/apiEndpoints.js";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const { getToken } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = await getToken();
      await axios.post(apiEndpoints.SUPPORT, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error("Error sending support email:", error);
      setIsSubmitting(false);
      setSubmitStatus("error");
    }
  };

  return (
    <DashboardLayout activeMenu="Support">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Email Support
          </h1>
          <p className="text-gray-600 mt-2 dark:text-gray-400">
            Have a question or need assistance? Send us a message and our
            support team will get back to you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 dark:bg-blue-900/50 dark:border-blue-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/50">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">
                  Email Us
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">
                For general inquiries and support requests.
              </p>
              <a
                href="mailto:support@skylink.com"
                className="text-blue-600 font-medium hover:underline dark:text-blue-400"
              >
                support@skylink.com
              </a>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 dark:bg-purple-900/50 dark:border-purple-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/50">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">
                  Live Chat
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">
                Available for Premium and Ultimate users.
              </p>
              <button
                className="text-purple-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed dark:text-purple-400"
                disabled
              >
                Chat Currently Offline
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">
              Send us a message
            </h2>

            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 dark:bg-green-900/50 dark:border-green-700">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 dark:text-green-400" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-200">
                    Message Sent!
                  </h4>
                  <p className="text-green-700 text-sm mt-1 dark:text-green-300">
                    Thank you for contacting us. We’ve received your request and sent a confirmation email. Our team will get back to you shortly.
                  </p>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 dark:bg-red-900/50 dark:border-red-700">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 dark:text-red-400" />
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-200">
                    Failed to Send
                  </h4>
                  <p className="text-red-700 text-sm mt-1 dark:text-red-300">
                    Something went wrong. Please try again later.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  placeholder="Describe your issue or question..."
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
