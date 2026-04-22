import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Navigation from './Navigation';
import { getTranslation } from '../translations';
import ApiService from '../services/api';

interface RegistrationFormProps {
  language: 'en' | 'am';
}

interface FormData {
  studentName: string;
  fatherName: string;
  grandfatherName: string;
  birthDate: string;
  age: number;
  christianName?: string;
  phone?: string;
  address: string;
  subcity: string;
  district: string;
  houseNumber: string;
  guardianName: string;
  relationship: string;
  guardianPhone?: string;
  classLevel: number;
  studentPhoto: FileList;
  guardianPhoto: FileList;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ language }) => {
  const [studentPhotoPreview, setStudentPhotoPreview] = useState<string | null>(null);
  const [guardianPhotoPreview, setGuardianPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const t = (key: string) => getTranslation(language, key);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'student' | 'guardian') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (type === 'student') setStudentPhotoPreview(ev.target?.result as string);
        else setGuardianPhotoPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const studentPhoto = data.studentPhoto?.[0];
      const guardianPhoto = data.guardianPhoto?.[0];

      if (!studentPhoto || !guardianPhoto) {
        toast.error(t('photoRequired'));
        return;
      }

      const studentData = {
        studentNameAm: language === 'am' ? data.studentName : '',
        studentNameEn: language === 'en' ? data.studentName : '',
        fatherNameAm: language === 'am' ? data.fatherName : '',
        fatherNameEn: language === 'en' ? data.fatherName : '',
        grandfatherNameAm: language === 'am' ? data.grandfatherName : '',
        grandfatherNameEn: language === 'en' ? data.grandfatherName : '',
        birthDate: data.birthDate,
        age: data.age,
        christianNameAm: language === 'am' ? (data.christianName || '') : '',
        christianNameEn: language === 'en' ? (data.christianName || '') : '',
        confessionFatherAm: '', confessionFatherEn: '',
        phone: data.phone || '',
        addressAm: language === 'am' ? data.address : '',
        addressEn: language === 'en' ? data.address : '',
        subcityAm: language === 'am' ? data.subcity : '',
        subcityEn: language === 'en' ? data.subcity : '',
        districtAm: language === 'am' ? data.district : '',
        districtEn: language === 'en' ? data.district : '',
        houseNumber: data.houseNumber,
        schoolLevelAm: '', schoolLevelEn: '', studentPhone: '',
        guardianNameAm: language === 'am' ? data.guardianName : '',
        guardianNameEn: language === 'en' ? data.guardianName : '',
        relationshipAm: language === 'am' ? data.relationship : '',
        relationshipEn: language === 'en' ? data.relationship : '',
        guardianDistrictAm: '', guardianDistrictEn: '',
        guardianHouseNumber: '',
        guardianPhone: data.guardianPhone || '',
        classLevel: data.classLevel,
        formFillerNameAm: '', formFillerNameEn: '',
        responsiblePersonAm: '', responsiblePersonEn: '',
      };

      const response = await ApiService.createStudent(studentData, studentPhoto, guardianPhoto);
      toast.success(`${t('registrationSuccess')} ID: ${response.data.studentId}`);
      setTimeout(() => { window.location.href = `/${language}`; }, 2000);
    } catch (error: any) {
      toast.error(error?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const relationships = language === 'am' 
    ? ['', 'አባት', 'እናት', 'አያት', 'ወንድም', 'እህት', 'ሌላ']
    : ['', 'Father', 'Mother', 'Grandfather', 'Brother', 'Sister', 'Other'];

  const inputClass = `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${language === 'am' ? 'amharic' : ''}`;
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'am' ? 'amharic' : ''}`}>
      <Navigation language={language} />
      
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div style={{ backgroundColor: 'var(--orthodox-blue)', color: 'white', padding: '1.5rem', borderRadius: '0.5rem 0.5rem 0 0' }}>
            <h1 className="text-2xl font-bold text-center">{t('register')}</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '1.5rem' }}>
            {/* Student Information */}
            <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <legend style={{ padding: '0 0.5rem', fontWeight: '600', color: '#1f2937' }}>{t('studentInfo')}</legend>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={labelClass}>{t('studentName')} *</label>
                  <input {...register('studentName', { required: true })} className={inputClass} placeholder={language === 'am' ? 'የተማሪ ሙሉ ስም' : 'Full Name'} />
                  {errors.studentName && <span className={errorClass}>{language === 'am' ? 'ያስፈልጋል' : 'Required'}</span>}
                </div>

                <div>
                  <label className={labelClass}>{t('fatherName')} *</label>
                  <input {...register('fatherName', { required: true })} className={inputClass} placeholder={language === 'am' ? 'የአባት ስም' : "Father's Name"} />
                </div>

                <div>
                  <label className={labelClass}>{t('grandfatherName')} *</label>
                  <input {...register('grandfatherName', { required: true })} className={inputClass} placeholder={language === 'am' ? 'የአያት ስም' : "Grandfather's Name"} />
                </div>

                <div>
                  <label className={labelClass}>{t('birthDate')} *</label>
                  <input type="date" {...register('birthDate', { required: true })} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>{t('age')} *</label>
                  <input type="number" min="5" max="50" {...register('age', { required: true })} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>{t('christianName')}</label>
                  <input {...register('christianName')} className={inputClass} placeholder={language === 'am' ? 'የክርስትና ስም' : 'Christian Name'} />
                </div>

                <div>
                  <label className={labelClass}>{t('phone')}</label>
                  <input {...register('phone')} className={inputClass} placeholder={language === 'am' ? 'ስልክ' : 'Phone'} />
                </div>

                <div>
                  <label className={labelClass}>{t('address')} *</label>
                  <input {...register('address', { required: true })} className={inputClass} placeholder={language === 'am' ? 'አድራሻ' : 'Address'} />
                </div>

                <div>
                  <label className={labelClass}>{t('subcity')} *</label>
                  <input {...register('subcity', { required: true })} className={inputClass} placeholder={language === 'am' ? 'ክ/ከተማ' : 'Sub-city'} />
                </div>

                <div>
                  <label className={labelClass}>{t('district')} *</label>
                  <input {...register('district', { required: true })} className={inputClass} placeholder={language === 'am' ? 'ወረዳ' : 'District'} />
                </div>

                <div>
                  <label className={labelClass}>{t('houseNumber')} *</label>
                  <input {...register('houseNumber', { required: true })} className={inputClass} placeholder={language === 'am' ? 'የቤት ቁጥር' : 'House No.'} />
                </div>

                <div>
                  <label className={labelClass}>{t('classLevel')} *</label>
                  <select {...register('classLevel', { required: true })} className={inputClass}>
                    <option value="">{language === 'am' ? 'ይምረጡ' : 'Select'}</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i+1} value={i+1}>{language === 'am' ? `${i+1}ኛ ክፍል` : `Grade ${i+1}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Guardian Information */}
            <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <legend style={{ padding: '0 0.5rem', fontWeight: '600', color: '#1f2937' }}>{t('guardianInfo')}</legend>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={labelClass}>{t('guardianName')} *</label>
                  <input {...register('guardianName', { required: true })} className={inputClass} placeholder={language === 'am' ? 'የተጠሪ ስም' : 'Guardian Name'} />
                </div>

                <div>
                  <label className={labelClass}>{t('relationship')} *</label>
                  <select {...register('relationship', { required: true })} className={inputClass}>
                    {relationships.map((r, i) => <option key={i} value={r}>{r || (language === 'am' ? 'ይምረጡ' : 'Select')}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>{t('guardianPhone')}</label>
                  <input {...register('guardianPhone')} className={inputClass} placeholder={language === 'am' ? 'የተጠሪ ስልክ' : 'Guardian Phone'} />
                </div>

                <div></div>
              </div>
            </fieldset>

            {/* Photos */}
            <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <legend style={{ padding: '0 0.5rem', fontWeight: '600', color: '#1f2937' }}>{language === 'am' ? 'ፎቶዎች' : 'Photos'}</legend>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className={labelClass}>{t('studentPhoto')} *</label>
                  <div style={{ border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                    {studentPhotoPreview ? (
                      <img src={studentPhotoPreview} alt="Student" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', margin: '0 auto 0.5rem' }} />
                    ) : (
                      <div style={{ width: '80px', height: '80px', backgroundColor: '#e5e7eb', borderRadius: '0.5rem', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                    )}
                    <input type="file" accept="image/*" {...register('studentPhoto', { required: true })} onChange={(e) => handlePhotoChange(e, 'student')} id="sp" style={{ display: 'none' }} />
                    <label htmlFor="sp" style={{ cursor: 'pointer', backgroundColor: 'var(--orthodox-blue)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                      {language === 'am' ? 'ምረጥ' : 'Choose'}
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t('guardianPhoto')} *</label>
                  <div style={{ border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                    {guardianPhotoPreview ? (
                      <img src={guardianPhotoPreview} alt="Guardian" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', margin: '0 auto 0.5rem' }} />
                    ) : (
                      <div style={{ width: '80px', height: '80px', backgroundColor: '#e5e7eb', borderRadius: '0.5rem', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                    )}
                    <input type="file" accept="image/*" {...register('guardianPhoto', { required: true })} onChange={(e) => handlePhotoChange(e, 'guardian')} id="gp" style={{ display: 'none' }} />
                    <label htmlFor="gp" style={{ cursor: 'pointer', backgroundColor: 'var(--orthodox-blue)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                      {language === 'am' ? 'ምረጥ' : 'Choose'}
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--orthodox-red)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? (language === 'am' ? 'እየተመዘገበ ነው...' : 'Submitting...') : t('submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
