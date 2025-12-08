import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'; // Import react-hot-toast

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        StudentID: "",
        LastName: "",
        FirstName: "",
        MI: "",
        EmailAddress: "",
        Password: "",
        Birthday: "",
        Address: "",
        ContactNumber: "",
        Course: "",
        // Default na Student ang napili
        Role: "Student" 
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // ✅ FIX: MAP THE FRONTEND PASCALCASE KEYS TO BACKEND SNAKE_CASE KEYS
        const dataToSend = {
            // Mapping fields used by the backend's auth.js route
            user_code: formData.StudentID,
            email: formData.EmailAddress,
            password: formData.Password,
            user_role: formData.Role, // Sending as "Student" or "Instructor"

            // Profile fields for INSERT statement
            user_fn: formData.FirstName,
            user_ln: formData.LastName,
            stud_id: formData.StudentID, 
            stud_course: formData.Course
        };
        
        try {
            // Use the mapped dataToSend object
            const response = await axios.post("http://localhost:5000/api/register", dataToSend); 
            
            // Success Notification
            toast.success("Registered successfully! You can now login.");
            navigate("/login");
            
        } catch (error) {
            console.error("Registration failed:", error);
            
            // Error Notification, kukunin ang message galing sa backend 
            const errorMessage = error.response?.data?.message || "Registration failed. Please check your inputs.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#3d4b7d] py-10">
            <div className="bg-[#535f91] p-8 rounded-xl w-[500px] shadow-2xl border border-gray-600">
                <h1 className="text-white text-3xl font-bold text-center mb-2">Create Account</h1>
                <p className="text-center text-gray-300 mb-6 text-sm">Join the LMS today</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    
                    {/* Role Selection (Student or Instructor) */}
                    <div className="pt-2">
                        <label className="text-sm text-white block mb-2">Registering as:</label>
                        <div className="flex gap-6 justify-center">
                            
                            {/* Student Radio Button */}
                            <label className="inline-flex items-center text-white cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="Role" 
                                    value="Student" 
                                    checked={formData.Role === 'Student'}
                                    onChange={handleChange} 
                                    className="form-radio text-green-500 bg-transparent border-white focus:ring-green-500"
                                />
                                <span className="ml-2">Student</span>
                            </label>

                            {/* Instructor Radio Button */}
                            <label className="inline-flex items-center text-white cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="Role" 
                                    value="Instructor" 
                                    checked={formData.Role === 'Instructor'}
                                    onChange={handleChange} 
                                    className="form-radio text-purple-500 bg-transparent border-white focus:ring-purple-500"
                                />
                                <span className="ml-2">Instructor</span>
                            </label>
                            
                        </div>
                    </div>
                    {/* End Role Selection */}


                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <input type="text" name="StudentID" onChange={handleChange} placeholder="Student/Employee ID *" className="w-full p-2 rounded bg-[#7a85b6] text-white placeholder-gray-300 outline-none" required />
                        </div>
                        <div>
                            <input type="text" name="FirstName" onChange={handleChange} placeholder="First Name *" className="w-full p-2 rounded bg-[#7a85b6] text-white placeholder-gray-300 outline-none" required />
                        </div>
                        <div>
                            <input type="text" name="LastName" onChange={handleChange} placeholder="Last Name *" className="w-full p-2 rounded bg-[#7a85b6] text-white placeholder-gray-300 outline-none" required />
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <input type="text" name="MI" onChange={handleChange} placeholder="M.I." className="w-1/4 p-2 rounded bg-[#7a85b6] text-white placeholder-gray-300 outline-none" maxLength={5} />
                        <input type="text" name="Course" onChange={handleChange} placeholder="Course / Department" className="w-3/4 p-2 rounded bg-[#7a85b6] text-white placeholder-gray-300 outline-none" />
                    </div>

                    <input type="email" name="EmailAddress" onChange={handleChange} placeholder="Email Address *" className="w-full p-2 rounded bg-[#7a85b6] text-white placeholder-gray-300 outline-none" required />
                    <input type="password" name="Password" onChange={handleChange} placeholder="Password *" className="w-full p-2 rounded bg-[#7a85b6] text-white placeholder-gray-300 outline-none" required />

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-gray-300 ml-1">Birthday</label>
                            {/* NOTE: Kailangan ng value sa input[date] para ma-update nang tama */}
                            <input type="date" name="Birthday" onChange={handleChange} value={formData.Birthday} className="w-full p-2 rounded bg-[#7a85b6] text-white outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-300 ml-1">Contact No.</label>
                            <input type="text" name="ContactNumber" onChange={handleChange} placeholder="0917..." className="w-full p-2 rounded bg-[#7a85b6] text-white placeholder-gray-300 outline-none" />
                        </div>
                    </div>

                    <textarea name="Address" onChange={handleChange} rows="2" placeholder="Complete Address" className="w-full p-2 rounded bg-[#7a85b6] text-white placeholder-gray-300 outline-none"></textarea>

                    <button type="submit" className="w-full bg-green-600 text-white font-bold p-3 rounded mt-4 hover:bg-green-500 transition shadow-lg">
                        Register Now
                    </button>
                </form>

                <p className="text-white text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <span className="text-blue-300 font-bold cursor-pointer hover:underline" onClick={() => navigate("/login")}>
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;