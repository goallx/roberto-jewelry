"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import {
  UserIcon,
  PhoneIcon,
  AtSignIcon,
  CalendarIcon,
  MapPinIcon,
  SaveIcon,
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    email: "",
    birthday: "",
    street: "",
    city: "",
    zip_code: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setProfile((prev) => ({ ...prev, email: user.email || "" }));

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone_number, birthday, address")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile({
          full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          phone: data.phone_number || "",
          email: user.email || "",
          birthday: data.birthday || "",
          street: data.address.street,
          city: data.address.city,
          zip_code: data.address.zip,
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const [first_name, ...last_nameParts] = profile.full_name.split(' ');
    const last_name = last_nameParts.join(' ');

    const updates = {
      id: user?.id,
      first_name: first_name || "",
      last_name: last_name || "",
      phone_number: profile.phone,
      birthday: profile.birthday,
      address: {
        city: profile.city,
        street: profile.street,
        zip: profile.zip_code
      },
      updated_at: new Date().toISOString(),
    };

    let { error } = await supabase.from("profiles").upsert(updates).eq("id", user?.id)

    if (error) {
      alert("Error updating profile: " + error.message);
    } else {
      alert("Profile updated successfully!");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 my-28 p-4">
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            שם מלא
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            placeholder="הכנס שם מלא"
            value={profile.full_name}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <PhoneIcon className="w-4 h-4" />
            מספר טלפון
          </label>
          <input
            type="tel"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            placeholder="הכנס מספר טלפון"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <AtSignIcon className="w-4 h-4" />
            כתובת אימייל
          </label>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            placeholder="אימייל"
            disabled
            value={profile.email}
          />
          <p className="text-xs text-gray-500">לא ניתן לשנות את כתובת האימייל</p>
        </div>

        {/* Birthdate */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            תאריך לידה
          </label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            value={profile.birthday || ""}
            onChange={(e) =>
              setProfile({ ...profile, birthday: e.target.value })
            }
          />
        </div>

        {/* Address Section */}
        <div className="border-t pt-4 mt-2">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5" />
            כתובת
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Street */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                רחוב
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                placeholder="שם הרחוב"
                value={profile.street}
                onChange={(e) =>
                  setProfile({ ...profile, street: e.target.value })
                }
              />
            </div>

            {/* City */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                עיר
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                placeholder="שם העיר"
                value={profile.city}
                onChange={(e) =>
                  setProfile({ ...profile, city: e.target.value })
                }
              />
            </div>

            {/* Zip Code */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                מיקוד
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                placeholder="מיקוד"
                value={profile.zip_code}
                onChange={(e) =>
                  setProfile({ ...profile, zip_code: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <button
          onClick={updateProfile}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-6"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              מתעדכן...
            </>
          ) : (
            <>
              <SaveIcon className="w-5 h-5" />
              עדכון פרטים
            </>
          )}
        </button>
      </div>
    </div>
  );
}