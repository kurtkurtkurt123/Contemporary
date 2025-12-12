import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'; 
import { ArrowRightIcon, ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import GlobeImage from '../assets/images/globe.png';
import '../assets/styles/login.css';

// IDAGDAG ANG LINYA NA ITO (Kukunin ang Render API URL mula sa .env)
const API_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1);
    
    // 💡 FIXED: State keys now match the backend controller (snake_case/shorthand)
    const [formData, setFormData] = useState({
        stud_id: "",    // Used for StudentID
        user_ln: "",    // Used for LastName
        user_fn: "",    // Used for FirstName
        email: "",      // Used for EmailAddress
        password: "",   // Used for Password
        stud_course: "", // Used for Course
        user_role: "student" // Used for Role
    });
    
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false); 
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleNext = (e) => {
        e.preventDefault();

        // 1. Validation for Step 1 Fields (Email, Passwords, Role)
        if (step === 1) {
            // 💡 FIXED: Validation uses new state keys (formData.email, formData.password, etc.)
            if (!formData.email || !formData.password || !confirmPassword || !formData.user_role) {
                toast.error("Please fill in all account information fields.");
                return;
            }
            if (formData.password !== confirmPassword) {
                toast.error("Passwords do not match.");
                return;
            }
            if (formData.password.length < 8) {
                toast.error("Password must be at least 8 characters long.");
                return;
            }
            setStep(2);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation for Step 2 Fields (ID, Names, Course)
        const idFormatRegex = /^\d{2}-\d{4}$/; 
        // 💡 FIXED: Validation uses new state keys (formData.stud_id, formData.user_fn, etc.)
        if (!idFormatRegex.test(formData.stud_id)) {
            toast.error("Student/Employee ID must be in the format XX-XXXX (e.g., 23-2722).");
            return;
        }
        if (!formData.user_fn || !formData.user_ln || !formData.stud_course) {
            toast.error("Please fill in all personal details.");
            return;
        }

        if (loading) return; 
        setLoading(true);

        try {
            // Create a payload object to avoid sending unnecessary fields
            const payload = {
                ...formData
            };

            // If stud_course is empty, remove it from the payload to avoid sending undefined/null to backend
            if (!payload.stud_course) {
                delete payload.stud_course;
            }
            
            // API CALL UPDATED: Gumagamit na ng API_URL variable
            await axios.post(`${API_URL}/api/register`, payload);
            
            toast.success("Registered successfully! You can now login.");
            navigate("/login");
            
        } catch (error) {
            console.error("Axios Registration Error:", error);
            
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    // Base input classes for the glassmorphism theme
    const inputClass = "w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#3C467B] bg-city-pattern bg-cover">
            
            {/* Left Side (Globe and Text) ... */}
            <div className="hidden lg:flex w-1/2 p-10 flex-col justify-center items-center pl-20">
            
                {/* Globe Image Placeholder */}
                <div className="w-[300px] h-[300px] mb-8">
                  <img
                    src={GlobeImage} // Use imported image path
                    alt="Global Network"
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
            
                <div className="text-left"> {/* Changed text-right to text-left for consistency */}
                  <h2 className="text-white text-3xl font-light tracking-widest">
                    SOCSCI 3
                  </h2>
                  <h1 className="text-white text-4xl font-extrabold mt-1">
                    Learning Management System
                  </h1>
                </div>
              </div>
            

            {/* Right Side: Register Panel (Glassmorphism) */}
            <div className="w-full max-w-xl p-4 sm:p-8"> 
                <div className="bg-panel-dark/40 p-10 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md">

                    <div className="text-center mb-10">
                        <p className="text-white text-base font-light opacity-80 tracking-widest uppercase mb-2">
                            SOCSCI 3 LMS
                        </p>
                        <h1 className="text-white text-5xl font-light">Sign Up</h1>
                    </div>
                    
                    {/* PROGRESS BAR */}
                    <div className="flex justify-between mb-6 text-white/70 font-semibold">
                        <span className={step === 1 ? 'text-blue-400 border-b-2 border-blue-400' : ''}>Step 1: Account</span>
                        <span className={step === 2 ? 'text-blue-400 border-b-2 border-blue-400' : ''}>Step 2: Details</span>
                    </div>

                    <form onSubmit={step === 2 ? handleSubmit : handleNext} className="space-y-4">

                        {/* ========================================================= */}
                        {/* 🌟 STEP 1: ACCOUNT INFORMATION (Visible when step === 1) */}
                        {/* ========================================================= */}
                        {step === 1 && (
                            <div className="space-y-4">
                                
                                <h2 className="text-white text-xl font-medium pt-2">Account Information</h2>
                                
                                {/* Email Address */}
                                <div>
                                    <label className="text-white text-base block mb-1 font-medium">Email Address</label>
                                    {/* 💡 FIXED: name="email" */}
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" className={inputClass} required />
                                </div>
                                
                                {/* Password FIELD (WITH TOGGLE) */}
                                <div className="relative"> 
                                    <label className="text-white text-base block mb-1 font-medium">Password</label>
                                    {/* 💡 FIXED: name="password" */}
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder="Password *" 
                                        className={`${inputClass} pr-10`}
                                        required 
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-white/70 hover:text-white"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                                
                                {/* Confirm Password FIELD (WITH TOGGLE) */}
                                <div className="relative"> 
                                    <label className="text-white text-base block mb-1 font-medium">Confirm Password</label>
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        placeholder="Confirm Password *" 
                                        className={`${inputClass} pr-10`}
                                        required 
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-white/70 hover:text-white"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>

                                {/* Role Selection Dropdown */}
                                <div className="pt-2">
                                    <label htmlFor="user_role" className="text-white  text-base block mb-1 font-medium">Registering as:</label>
                                    {/* 💡 FIXED: name="user_role" and id="user_role" */}
                                    <select
                                        id="user_role"
                                        name="user_role"
                                        value={formData.user_role}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClass}  appearance-none cursor-pointer pr-10`}
                                    >
                                        <option value="student" className="bg-black hover:bg-black/10">Student</option>
                                        <option value="uo_staff" className="bg-black hover:bg-black/10">Staff</option>
                                    </select>
                                </div>
                                
                                {/* NEXT BUTTON */}
                                <button 
                                    type="submit" 
                                    className="w-full bg-blue-600 text-white font-semibold text-lg p-3 rounded-lg mt-6 hover:bg-blue-500 transition duration-200 shadow-xl flex items-center justify-center"
                                >
                                    Next <ArrowRightIcon className="h-5 w-5 ml-2" />
                                </button>
                            </div>
                        )}
                        
                        {/* ========================================================== */}
                        {/* 🌟 STEP 2: PERSONAL DETAILS (Visible when step === 2) */}
                        {/* ========================================================== */}
                        {step === 2 && (
                            <div className="space-y-4">
                                
                                <h2 className="text-white text-xl font-medium pt-2">Personal Details</h2>

                                {/* ID and Name */}
                                <div className="grid grid-cols-6 gap-3">
                                    <div className="col-span-3">
                                        <label className="text-white text-base block mb-1 font-medium">First Name</label>
                                        {/* 💡 FIXED: name="user_fn" */}
                                        <input type="text" name="user_fn" value={formData.user_fn} onChange={handleChange} placeholder="First Name *" className={inputClass} required />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-white text-base block mb-1 font-medium">Last Name</label>
                                        {/* 💡 FIXED: name="user_ln" */}
                                        <input type="text" name="user_ln" value={formData.user_ln} onChange={handleChange} placeholder="Last Name *" className={inputClass} required />
                                    </div>
                                    <div className="col-span-6">
                                        <label className="text-white text-base block mb-1 font-medium">Student / Employee ID</label>
                                        {/* 💡 FIXED: name="stud_id" */}
                                        <input
                                            type="text"
                                            name="stud_id"
                                            value={formData.stud_id}
                                            onChange={handleChange}
                                            placeholder="ID (e.g., 23-2722) *"
                                            className={inputClass}
                                            required
                                            pattern="\d{2}-\d{4}"
                                            title="ID must be in the format XX-XXXX (e.g., 23-2722)"
                                        />
                                    </div>
                                </div>

                                {/* Course/Department */}
                                <div>
                                    <label className="text-white text-base block mb-1 font-medium">Course / Department</label>
                                    {/* 💡 FIXED: name="stud_course" */}
                                    <input type="text" name="stud_course" value={formData.stud_course} onChange={handleChange} placeholder="Course / Department" className={inputClass} />
                                </div>
                                
                                {/* BACK & SUBMIT BUTTONS */}
                                <div className="flex justify-between gap-4 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(1)}
                                        className="w-1/3 flex items-center justify-center bg-white/20 text-white font-semibold p-3 rounded-lg hover:bg-white/30 transition duration-200"
                                    >
                                        <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back
                                    </button>
                                    
                                    {/* SUBMIT BUTTON */}
                                    <button 
                                        type="submit" 
                                        className="w-2/3 bg-green-600 text-white font-semibold text-lg p-3 rounded-lg hover:bg-green-500 transition duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? 'Registering...' : 'Register Now'}
                                    </button>
                                </div>
                            </div>
                        )}
                        
                    </form>

                    <p className="text-white text-center mt-6 text-base">
                        Already have an account?{" "}
                        <span className="text-blue-300 font-semibold cursor-pointer hover:text-blue-200" onClick={() => navigate("/login")}>
                            Login here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;