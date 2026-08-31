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
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#2B2421] text-white py-24 sm:py-32"
    >
      {/* Background Image: 4.jpg */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/media/4.jpg"
          alt="Hasan and Zainab RSVP Background"
          className="w-full h-full object-cover object-center contrast-[1.05] brightness-[0.75] saturate-[0.95]"
          loading="lazy"
        />
        {/* Soft vignette overlays for flawless text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/20 via-transparent to-[#FAF7F2]/10" />
        <div className="absolute inset-0 film-grain pointer-events-none opacity-35" />
      </div>

      {/* Subtle floating ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        <div className="absolute top-[20%] left-[12%] w-2.5 h-2.5 rounded-full bg-white/25 blur-[1px]" />
        <div className="absolute top-[38%] right-[14%] w-2 h-2 rounded-full bg-white/20 blur-[1px]" />
        <div className="absolute bottom-[25%] left-[18%] w-3 h-3 rounded-full bg-white/20 blur-[1px]" />
      </div>

      {/* RSVP Content Overlaying the Background Image directly */}
      <div className="w-full max-w-xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center"
        >
          {/* Section Header */}
          <div className="text-center mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            <h2 className="font-display-luxury text-3xl sm:text-4xl md:text-5xl font-light text-white uppercase tracking-[0.2em]">
              KINDLY RSVP
            </h2>
            <h3 className="font-arabic-calligraphy text-4xl sm:text-5xl text-[#F7E7CE] mt-2">
              تأكيد الحضور
            </h3>
          </div>

          {/* ADULTS-ONLY CELEBRATION NOTICE */}
          <div className="w-full mb-8 py-3.5 px-5 bg-black/40 backdrop-blur-sm border border-white/25 rounded-2xl text-center drop-shadow-md">
            <p className="font-sans-luxury text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#F9D5D7] font-semibold">
              ADULTS-ONLY CELEBRATION — NO CHILDREN ARE ALLOWED
            </p>
            <p className="font-arabic text-sm sm:text-base text-[#F9D5D7] font-medium mt-1" dir="rtl">
              الحفل مخصص للكبار فقط — يُرجى بكل مودة عدم اصطحاب الأطفال
            </p>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full text-center py-6 bg-black/40 backdrop-blur-md border border-white/20 p-8 rounded-2xl drop-shadow-lg"
            >
              <div className="w-14 h-14 rounded-full border border-[#F7E7CE] flex items-center justify-center mx-auto mb-4 bg-white/10">
                <CheckCircle2 size={28} className="text-[#F7E7CE]" />
              </div>
              <h4 className="font-display-luxury text-2xl sm:text-3xl tracking-[0.15em] text-white uppercase font-medium mb-1">
                THANK YOU
              </h4>
              <p className="font-arabic-calligraphy text-3xl text-[#F7E7CE] mb-2">
                شكراً لتأكيدكم
              </p>
              <p className="font-serif-luxury italic text-sm sm:text-base text-white/90 max-w-md mx-auto mb-6">
                Your response has been warmly received and recorded.
              </p>

              <div className="bg-white/10 border border-white/20 p-4 rounded-xl max-w-sm mx-auto text-xs font-sans-luxury text-white/90 mb-6 space-y-2">
                <p>
                  <strong className="text-white uppercase tracking-wider text-sm">{savedRecord?.name}</strong>
                </p>
                <p className="flex justify-between items-center border-t border-white/15 pt-2">
                  <span>Status / الحالة:</span>
                  <span className="font-bold text-[#F7E7CE]">
                    {savedRecord?.attending === 'yes' ? 'Attending · حاضر بكل سرور' : 'Declined · معتذر'}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setIsSuccess(false)}
                className="text-xs font-sans-luxury tracking-[0.2em] text-[#F7E7CE] hover:text-white uppercase underline underline-offset-4 transition-colors cursor-pointer"
              >
                EDIT RESPONSE · تعديل الرد
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              {errorMessage && (
                <div className="p-3 bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-sans-luxury rounded-xl text-center">
                  {errorMessage}
                </div>
              )}

              {/* Guest Full Name */}
              <div>
                <label className="block text-[11px] sm:text-xs font-sans-luxury tracking-[0.18em] text-white/90 uppercase font-medium mb-2 drop-shadow-sm">
                  FULL NAME / الاسم الكريم <span className="text-[#F7E7CE]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name / اكتب اسمك"
                  className="w-full bg-white/10 border border-white/30 focus:border-[#F7E7CE] text-white placeholder:text-white/40 px-4 py-3.5 text-sm font-sans-luxury focus:outline-none transition-colors rounded-xl backdrop-blur-sm shadow-inner"
                />
              </div>

              {/* Attendance Selection */}
              <div>
                <label className="block text-[11px] sm:text-xs font-sans-luxury tracking-[0.18em] text-white/90 uppercase font-medium mb-2.5 drop-shadow-sm">
                  WILL YOU JOIN US? / هل ستشاركوننا الحفل؟ <span className="text-[#F7E7CE]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* YES Option */}
                  <button
                    type="button"
                    onClick={() => setAttending('yes')}
                    className={`py-3.5 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 cursor-pointer backdrop-blur-sm ${
                      attending === 'yes'
                        ? 'border-[#F7E7CE] bg-white/20 text-white shadow-[0_0_15px_rgba(247,231,206,0.25)]'
                        : 'border-white/25 bg-black/20 text-white/80 hover:border-white/50'
                    }`}
                  >
                    <div className="text-left">
                      <span className="font-sans-luxury text-xs tracking-[0.15em] uppercase font-bold block text-white">
                        YES, WITH PLEASURE
                      </span>
                      <span className="font-arabic text-xs text-[#F7E7CE]">
                        نعم، بكل سرور
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        attending === 'yes'
                          ? 'border-[#F7E7CE] bg-[#F7E7CE] text-[#2B2421]'
                          : 'border-white/40'
                      }`}
                    >
                      {attending === 'yes' && <Check size={12} className="stroke-[3]" />}
                    </div>
                  </button>

                  {/* NO Option */}
                  <button
                    type="button"
                    onClick={() => setAttending('no')}
                    className={`py-3.5 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 cursor-pointer backdrop-blur-sm ${
                      attending === 'no'
                        ? 'border-[#F7E7CE] bg-white/20 text-white shadow-[0_0_15px_rgba(247,231,206,0.25)]'
                        : 'border-white/25 bg-black/20 text-white/80 hover:border-white/50'
                    }`}
                  >
                    <div className="text-left">
                      <span className="font-sans-luxury text-xs tracking-[0.15em] uppercase font-bold block text-white">
                        REGRETFULLY DECLINE
                      </span>
                      <span className="font-arabic text-xs text-white/70">
                        نعتذر عن الحضور
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        attending === 'no'
                          ? 'border-[#F7E7CE] bg-[#F7E7CE] text-[#2B2421]'
                          : 'border-white/40'
                      }`}
                    >
                      {attending === 'no' && <Check size={12} className="stroke-[3]" />}
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 border-2 border-[#F7E7CE] hover:border-white bg-[#F7E7CE]/15 hover:bg-[#F7E7CE]/25 backdrop-blur-[2px] text-white text-xs sm:text-sm font-sans-luxury tracking-[0.25em] uppercase font-bold rounded-none transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:scale-[1.01] cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isSubmitting ? 'CONFIRMING...' : 'CONFIRM RSVP'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F7E7CE]" />
                <span className="font-arabic font-normal text-base text-[#F7E7CE]">تأكيد الحضور</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
