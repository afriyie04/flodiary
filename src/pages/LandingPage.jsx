import React from "react";
import NavigationBar from "../components/NavigationBar";
import girlSmilingLanding from "../assets/girl-smiling-landing.jpg";
import Footer from "../components/Footer";

function LandingPage() {
  return (
    <div className="">
      <NavigationBar />

      <div
        style={{
          backgroundImage: `url(${girlSmilingLanding})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
        className="flex flex-col items-center justify-center h-[600px]"
      >
        <div className="flex flex-col items-center justify-center">
          <p className="text-4xl font-bold text-center mb-8 text-white">
            Know Your Body, <br />
            <span className="text-pink-300">Own Your Cycle.</span>
          </p>
          <p className="text-lg text-center text-white">
            Track your period, understand your body and take control of your
            health.{" "}
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-purple-700 hover:bg-purple-800 cursor-pointer font-semibold text-white px-4 py-2 rounded-full mt-8"
          >
            Get Started
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pt-10 md:pt-0 min-h-[600px] bg-pink-100">
        <p className="text-4xl font-bold text-center mb-8 text-purple-800">
          Why CycleSync?
        </p>
        <p className="text-lg text-center text-gray-700">
          Designed to bring you clarity, comfort and control. Our AI-backed
          features help you tune into your body with confidence.{" "}
        </p>

        {/* Features Section */}
        <div className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Smart Predictions Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-purple-900 mb-4">
                  Smart Predictions
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  AI-driven forecasts for period, ovulation, and mood tracking
                  with simplicity and accuracy.
                </p>
              </div>

              {/* Reminders That Matter Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-purple-900 mb-4">
                  Reminders That Matter
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Get elegant, non-intrusive alerts tailored to your needs and
                  lifestyle.
                </p>
              </div>

              {/* Insightful Logs Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-purple-900 mb-4">
                  Insightful Logs
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Track symptoms beautifully to understand the rhythm of your
                  health and hormones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-purple-50 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-12">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "CycleSync has changed how I understand my body. It's accurate
                and so easy to use!"
              </p>
              <p className="text-purple-900 font-semibold">- Ama B.</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "I love the simplicity and the reminders. I feel more in control
                of my health."
              </p>
              <p className="text-purple-900 font-semibold">- Nana K.</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "The insights I've gotten have helped me explain symptoms to my
                doctor more clearly."
              </p>
              <p className="text-purple-900 font-semibold">- Esi M.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
