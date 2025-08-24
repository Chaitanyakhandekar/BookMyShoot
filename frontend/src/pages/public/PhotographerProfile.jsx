import React, { useState } from "react";
import {
  Camera,
  Star,
  MapPin,
  Award,
  Clock,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Shield,
  Check,
  X,
  Mail,
  Phone,
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  Users,
  Briefcase,
  Languages,
  Package,
} from "lucide-react";

const PhotographerProfile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [photographers, setPhotographers] = useState(null);

  React.useEffect(()=>{
    const fetchPhotographers = async () => {
      let p = localStorage.getItem('photographers');
      setPhotographers(JSON.parse(p));
    };

    fetchPhotographers();
  },[])

  const photographer = {
    name: photographers ? photographers[0].name : "John Doe",
    location: photographers ? photographers[0].location : "Unknown",
    rating: photographers ? photographers[0].rating : 0,
    reviews: photographers ? photographers[0].reviews : 0,
    experience: photographers ? photographers[0].experience : "0 years",
    priceRange: photographers ? photographers[0].priceRange : "$0 - $0",
    languages: photographers ? photographers[0].languages : [
      "English",
      "Spanish",
      "French"
    ],
    specialties: photographers ? photographers[0].specialties : [
      "Wedding",
      "Portrait",
      "Fashion"
    ],
    packages: photographers ? photographers[0].packages : [
      {
        name: "Basic Package",
        price: "$1000",
        features: [
          "5 hours of coverage",
          "1 photographer",
          "Online gallery"
        ]
      },
      {
        name: "Standard Package",
        price: "$2000",
        features: [
          "10 hours of coverage",
          "2 photographers",
          "Online gallery",
          "USB drive with edited photos"
        ]
      },
      {
        name: "Premium Package",
        price: "$3000",
        features: [
          "All-day coverage",
          "2 photographers",
          "Online gallery",
          "USB drive with edited photos",
          "Pre-wedding photoshoot"
        ]
      }
    ],
    portfolio: photographers ? photographers[0].portfolio : [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop"
    ],
    achievements: photographers ? photographers[0].achievements : [
      "Best Wedding Photographer 2023",
      "Featured in National Geographic",
      "500+ Successful Events"
    ],
  };

  const ImageModal = ({ image, onClose }) => {
    if (!image) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 hover:bg-gray-800 rounded-full"
        >
          <X className="h-6 w-6" />
        </button>
        <img src={image} alt="Full size" className="max-h-[90vh] max-w-[90vw] rounded-lg" />
      </div>
    );
  };

  const BookingModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Book {photographer.name}</h2>
            <button
              onClick={() => setShowBookingModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        bookingStep >= step
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-20 h-1 ${
                          bookingStep > step ? "bg-purple-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Event Details */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Event Details</h3>
                <input type="text" placeholder="Event Type" className="w-full p-3 border rounded-xl" />
                <input type="date" className="w-full p-3 border rounded-xl" />
                <input type="text" placeholder="Location" className="w-full p-3 border rounded-xl" />
                <button
                  onClick={() => setBookingStep(2)}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl mt-4 hover:bg-purple-700"
                >
                  Next Step
                </button>
              </div>
            )}

            {/* Step 2: Additional Services */}
            {bookingStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Additional Services</h3>
                <div className="space-y-2">
                  {["Drone Photography", "Video Coverage", "Photo Album"].map((service) => (
                    <label key={service} className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="w-1/2 border py-3 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setBookingStep(3)}
                    className="w-1/2 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact Info */}
            {bookingStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Your Information</h3>
                <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-xl" />
                <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-xl" />
                <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-xl" />
                <div className="flex space-x-2">
                  <button
                    onClick={() => setBookingStep(2)}
                    className="w-1/2 border py-3 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="w-1/2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Photographer Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{photographer.name}</h1>
          <div className="flex items-center space-x-4 mt-2 text-gray-600">
            <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{photographer.location}</span>
            <span className="flex items-center"><Star className="h-4 w-4 mr-1 text-yellow-500" />{photographer.rating} ({photographer.reviews} reviews)</span>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="p-2 border rounded-lg hover:bg-gray-50"><Heart className="h-5 w-5" /></button>
          <button className="p-2 border rounded-lg hover:bg-gray-50"><Share2 className="h-5 w-5" /></button>
          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Portfolio */}
      <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photographer.portfolio.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt="Portfolio"
            className="rounded-lg cursor-pointer hover:opacity-80"
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      {/* Achievements */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Achievements</h2>
      <ul className="list-disc list-inside space-y-2">
        {photographer.achievements.map((ach, idx) => (
          <li key={idx}>{ach}</li>
        ))}
      </ul>

      {/* Modals */}
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      {showBookingModal && <BookingModal />}
    </div>
  );
};

export default PhotographerProfile;
