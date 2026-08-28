import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, CheckCircle2 } from 'lucide-react';
import { RSVPRecord } from '../types';
import { dataStore } from '../services/dataStore';

export const RsvpSection: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [savedRecord, setSavedRecord] = useState<RSVPRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check if guest has previously responded on this device
  useEffect(() => {
    const saved = localStorage.getItem('zh_saved_rsvp');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedRecord(parsed);
        setName(parsed.name || '');
        setAttending(parsed.attending || 'yes');
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name · يرجى كتابة الاسم الكريم');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await dataStore.submitRsvp({
        name: name.trim(),
        attending,
        guestCount: attending === 'yes' ? 1 : 0,
        notes: '',
      });

      if (result.success) {
        setIsSuccess(true);
        setSavedRecord(result.rsvp);
        localStorage.setItem('zh_saved_rsvp', JSON.stringify(result.rsvp));
      } else {
        setErrorMessage('Failed to submit RSVP. Please try again.');
      }
    } catch (err) {
      console.error('RSVP submission error:', err);
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="relative w-full py-28 md:py-36 bg-[#FAF7F2] text-[#2B2421] overflow-hidden"
    >
      {/* Background Subtle Luxury Radial Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,#F5E5E2_0%,transparent_70%)] opacity-50 blur-2xl" />
      </div>

      <div className="max-w-xl mx-auto px-6 relative z-10">
        <div className="border border-[#EADBCE] p-8 sm:p-12 md:p-14 bg-[#FFFFFF] rounded-3xl shadow-[0_20px_60px_rgba(180,140,110,0.12)] relative">
          {/* Section Header - ENGLISH FIRST, ARABIC BENEATH */}
          <div className="text-center mb-8">
            <h2 className="font-display-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#2B2421] uppercase tracking-[0.18em]">
              KINDLY RSVP
            </h2>
            <h3 className="font-arabic-calligraphy text-3xl sm:text-4xl text-[#A67C2E] mt-1">
              تأكيد الحضور
            </h3>
          </div>

          {/* CRITICAL: ADULTS-ONLY CELEBRATION NOTICE */}
          <div className="mb-8 p-5 bg-[#FAF0ED] border-2 border-[#D49B9E] rounded-2xl shadow-sm text-center">
            <p className="font-sans-luxury text-xs sm:text-sm uppercase tracking-[0.15em] text-[#9E3E43] font-bold">
              ADULTS-ONLY CELEBRATION — NO CHILDREN ARE ALLOWED
            </p>
            <p className="font-arabic text-sm sm:text-base text-[#9E3E43] font-bold mt-1" dir="rtl">
              الحفل مخصص للكبار فقط — يُرجى بكل مودة عدم اصطحاب الأطفال
            </p>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-full border border-[#C5A059] flex items-center justify-center mx-auto mb-5 bg-[#FAF7F2]">
                <CheckCircle2 size={30} className="text-[#A67C2E]" />
              </div>
              <h4 className="font-display-luxury text-2xl sm:text-3xl tracking-[0.15em] text-[#2B2421] uppercase font-medium mb-1">
                THANK YOU
              </h4>
              <p className="font-arabic-calligraphy text-2xl text-[#A67C2E] mb-3">
                شكراً لتأكيدكم
              </p>
              <p className="font-serif-luxury italic text-base text-[#6B5E55] max-w-md mx-auto mb-6">
                Your response has been warmly received and recorded.
              </p>

              <div className="bg-[#FAF7F2] border border-[#EADBCE] p-5 rounded-2xl max-w-sm mx-auto text-xs font-sans-luxury text-[#6B5E55] mb-6 space-y-2">
                <p>
                  <strong className="text-[#2B2421] uppercase tracking-wider text-sm">{savedRecord?.name}</strong>
                </p>
                <p className="flex justify-between items-center border-t border-[#EADBCE] pt-2">
                  <span>Status / الحالة:</span>
                  <span className="font-bold text-[#2B2421]">
                    {savedRecord?.attending === 'yes' ? 'Attending · حاضر بكل سرور' : 'Declined · معتذر'}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setIsSuccess(false)}
                className="text-xs font-sans-luxury tracking-[0.2em] text-[#8C7D70] hover:text-[#2B2421] uppercase underline underline-offset-4 transition-colors cursor-pointer"
              >
                EDIT RESPONSE · تعديل الرد
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans-luxury rounded-xl">
                  {errorMessage}
                </div>
              )}

              {/* Guest Full Name */}
              <div>
                <label className="block text-[11px] font-sans-luxury tracking-[0.15em] text-[#2B2421] uppercase font-bold mb-2">
                  FULL NAME / الاسم الكريم <span className="text-[#A67C2E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=""
                  className="w-full bg-[#FAF7F2] border border-[#EADBCE] focus:border-[#C5A059] text-[#2B2421] px-4 py-3.5 text-sm font-sans-luxury focus:outline-none transition-colors rounded-xl"
                />
              </div>

              {/* Attendance Selection */}
              <div>
                <label className="block text-[11px] font-sans-luxury tracking-[0.15em] text-[#2B2421] uppercase font-bold mb-2.5">
                  WILL YOU JOIN US? / هل ستشاركوننا الحفل؟ <span className="text-[#A67C2E]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* YES Option */}
                  <button
                    type="button"
                    onClick={() => setAttending('yes')}
                    className={`py-3.5 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 cursor-pointer ${
                      attending === 'yes'
                        ? 'border-[#C5A059] bg-[#FAF7F2] text-[#2B2421] shadow-sm'
                        : 'border-[#EADBCE] bg-[#FFFFFF] text-[#6B5E55] hover:border-[#C5A059]/50'
                    }`}
                  >
                    <div>
                      <span className="font-sans-luxury text-xs tracking-[0.15em] uppercase font-bold block">
                        YES, WITH PLEASURE
                      </span>
                      <span className="font-arabic text-xs text-[#8C7D70]">
                        نعم، بكل سرور
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        attending === 'yes'
                          ? 'border-[#C5A059] bg-[#C5A059] text-white'
                          : 'border-[#EADBCE]'
                      }`}
                    >
                      {attending === 'yes' && <Check size={12} />}
                    </div>
                  </button>

                  {/* NO Option */}
                  <button
                    type="button"
                    onClick={() => setAttending('no')}
                    className={`py-3.5 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 cursor-pointer ${
                      attending === 'no'
                        ? 'border-[#C5A059] bg-[#FAF7F2] text-[#2B2421] shadow-sm'
                        : 'border-[#EADBCE] bg-[#FFFFFF] text-[#6B5E55] hover:border-[#C5A059]/50'
                    }`}
                  >
                    <div>
                      <span className="font-sans-luxury text-xs tracking-[0.15em] uppercase font-bold block">
                        REGRETFULLY DECLINE
                      </span>
                      <span className="font-arabic text-xs text-[#8C7D70]">
                        نعتذر عن الحضور
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        attending === 'no'
                          ? 'border-[#C5A059] bg-[#C5A059] text-white'
                          : 'border-[#EADBCE]'
                      }`}
                    >
                      {attending === 'no' && <Check size={12} />}
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit Button in Bespoke Luxury Stationery Styling */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#2B2421] hover:bg-[#3D332F] border border-[#C5A059] text-[#FAF7F2] text-xs font-sans-luxury tracking-[0.25em] uppercase font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(43,36,33,0.15)] hover:shadow-[0_15px_35px_rgba(197,160,89,0.25)] hover:scale-[1.01] cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isSubmitting ? 'CONFIRMING...' : 'CONFIRM RSVP'}</span>
                <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
                <span className="font-arabic font-normal text-sm text-[#EADBCE]">تأكيد الحضور</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
