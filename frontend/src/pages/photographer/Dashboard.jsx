import React, { useState } from "react";
import { Upload, Plus, Trash2, Save } from "lucide-react";

const PhotographerDashboard = () => {
  const [photographer, setPhotographer] = useState({
    name: "John Smith",
    location: "New York, USA",
    languages: ["English", "Spanish"],
    specialties: ["Weddings", "Portraits"],
    packages: [
      { name: "Basic", price: "$150", duration: "1 hour" },
      { name: "Premium", price: "$500", duration: "Full day" },
    ],
    portfolio: [],
    achievements: [],
  });

  // Handle input change
  const handleChange = (field, value) => {
    setPhotographer({ ...photographer, [field]: value });
  };

  // Add new item (portfolio, packages, etc.)
  const addItem = (field, item) => {
    setPhotographer({ ...photographer, [field]: [...photographer[field], item] });
  };

  // Remove item
  const removeItem = (field, index) => {
    const updated = photographer[field].filter((_, i) => i !== index);
    setPhotographer({ ...photographer, [field]: updated });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📸 Photographer Dashboard</h1>

      {/* Profile Info */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Basic Info</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={photographer.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full p-3 border rounded-xl mb-3"
        />
        <input
          type="text"
          placeholder="Location"
          value={photographer.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="w-full p-3 border rounded-xl mb-3"
        />
      </div>

      {/* Specialties */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Specialties</h2>
        <div className="flex space-x-2 mb-3">
          <input
            id="specialtyInput"
            type="text"
            placeholder="Add specialty"
            className="flex-1 p-3 border rounded-xl"
          />
          <button
            onClick={() => {
              const input = document.getElementById("specialtyInput");
              if (input.value) {
                addItem("specialties", input.value);
                input.value = "";
              }
            }}
            className="bg-purple-600 text-white px-4 rounded-xl"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {photographer.specialties.map((sp, idx) => (
            <li
              key={idx}
              className="bg-purple-100 px-3 py-1 rounded-full flex items-center space-x-2"
            >
              <span>{sp}</span>
              <button onClick={() => removeItem("specialties", idx)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Packages */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Packages</h2>
        {photographer.packages.map((pkg, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={pkg.name}
              onChange={(e) => {
                const updated = [...photographer.packages];
                updated[idx].name = e.target.value;
                handleChange("packages", updated);
              }}
              className="flex-1 p-2 border rounded-lg"
            />
            <input
              type="text"
              value={pkg.price}
              onChange={(e) => {
                const updated = [...photographer.packages];
                updated[idx].price = e.target.value;
                handleChange("packages", updated);
              }}
              className="w-24 p-2 border rounded-lg"
            />
            <input
              type="text"
              value={pkg.duration}
              onChange={(e) => {
                const updated = [...photographer.packages];
                updated[idx].duration = e.target.value;
                handleChange("packages", updated);
              }}
              className="w-32 p-2 border rounded-lg"
            />
            <button onClick={() => removeItem("packages", idx)}>
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem("packages", { name: "", price: "", duration: "" })}
          className="flex items-center space-x-2 mt-3 bg-purple-600 text-white px-4 py-2 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          <span>Add Package</span>
        </button>
      </div>

      {/* Portfolio Upload */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
        <input
          type="text"
          placeholder="Paste image URL"
          id="portfolioInput"
          className="w-full p-3 border rounded-xl mb-3"
        />
        <button
          onClick={() => {
            const input = document.getElementById("portfolioInput");
            if (input.value) {
              addItem("portfolio", input.value);
              input.value = "";
            }
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl"
        >
          <Upload className="h-5 w-5 inline-block mr-2" /> Add Image
        </button>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {photographer.portfolio.map((img, idx) => (
            <div key={idx} className="relative">
              <img src={img} alt="Portfolio" className="rounded-lg" />
              <button
                onClick={() => removeItem("portfolio", idx)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        <div className="flex space-x-2 mb-3">
          <input
            id="achievementInput"
            type="text"
            placeholder="Add achievement"
            className="flex-1 p-3 border rounded-xl"
          />
          <button
            onClick={() => {
              const input = document.getElementById("achievementInput");
              if (input.value) {
                addItem("achievements", input.value);
                input.value = "";
              }
            }}
            className="bg-purple-600 text-white px-4 rounded-xl"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <ul className="list-disc list-inside space-y-1">
          {photographer.achievements.map((ach, idx) => (
            <li key={idx} className="flex items-center justify-between">
              {ach}
              <button onClick={() => removeItem("achievements", idx)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Save button */}
      <button className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2">
        <Save className="h-5 w-5" />
        <span>Save Profile</span>
      </button>
    </div>
  );
};

export default PhotographerDashboard;
