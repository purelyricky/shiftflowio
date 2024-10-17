"use client";
import productImage from "@/assets/product-image.png";
import pyramidImage from "@/assets/pyramid.png";
import tubeImage from "@/assets/tube.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  // New state for managing the active card
  const [activeCard, setActiveCard] = useState(0);

  // Card content
  const cards = [
    {
      title: "Workers",
      points: [
        "Access your shift schedule anytime from your phone or desktop.",
        "Get notified about upcoming shifts and changes instantly.",
        "Log attendance and request shift swaps easily through the app.",
        "Track your work hours and earnings transparently.",
      ],
    },
    {
      title: "Shift Leaders",
      points: [
        "View team schedules and fill last-minute gaps quickly.",
        "Monitor real-time attendance to ensure shift coverage.",
        "Communicate directly with workers for updates or adjustments.",
        "Generate shift performance reports for better team management.",
      ],
    },
    {
      title: "Client HR Department",
      points: [
        "Simplify workforce planning with data-driven insights.",
        "Track attendance and work patterns to optimize staffing needs.",
        "Automate payroll calculations, reducing manual errors.",
        "Access comprehensive reports to ensure compliance and budgeting.",
      ],
    },
    {
      title: "Workplace Entrance",
      points: [
        "Verify worker entry and exit in real-time with a secure access system.",
        "Track attendance to ensure only scheduled workers are on-site.",
        "Report discrepancies directly through the platform for quick resolution.",
        "Maintain a digital log of worker entries for accurate record-keeping.",
      ],
    },
  ];

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-24 overflow-x-clip">
      <div className="container max-w-[1200px]">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">What we offer to your workforce</div>
          </div>

          <h2 className="text-center text-3xl md:text-[52px] md:leading-[58px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5 max-w-[95%] mx-auto">
          Effortlessly Manage Your Workforce from Shift Assignment to Payroll
          </h2>
          <p className="section-des mt-5 max-w-[95%] mx-auto">
          With our platform, assign shifts with ease, monitor attendance in real-time, and automate payroll calculations. Stay informed with detailed reports, enabling you to optimize staffing, reduce costs, and focus on productivity.
          </p>
        </div>

        <div className="relative mt-10">
          <Image src={productImage} alt="Product image" className="mt-10" />
          <motion.img
            src={pyramidImage.src}
            alt="Pyramid image"
            height={262}
            width={262}
            className="hidden md:block absolute -right-36 -top-32"
            style={{
              translateY: translateY,
            }}
          />
          <motion.img
            src={tubeImage.src}
            alt="Tube image"
            height={248}
            width={248}
            className="hidden md:block absolute bottom-24 -left-36"
            style={{
              translateY: translateY,
            }}
          />
        </div>

        {/* New button and card section */}
        <div className="flex justify-center mt-10">
          <div className="tag cursor-pointer" onClick={() => setActiveCard(0)}>Features for Each User</div>
        </div>

        <div className="mt-5 flex flex-col items-center">
          <div className="flex space-x-2 mb-6">
            {cards.map((_, index) => (
              <button
                key={index}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCard === index
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                }`}
                onClick={() => setActiveCard(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg w-full max-w-2xl transition-all duration-300 transform hover:scale-105 md:h-[400px]">
            <h3 className="text-center text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-black">{cards[activeCard].title}</h3>
            <ul className="space-y-3 md:space-y-4">
              {cards[activeCard].points.map((point, idx) => (
                <li key={idx} className="flex items-start">
                  <svg className="w-6 h-6 text-black mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
