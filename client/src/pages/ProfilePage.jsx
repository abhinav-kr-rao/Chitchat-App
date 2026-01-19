import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';


const ProfilePage = () => {

    const { authUser, updateProfile } = useContext(AuthContext);


    const [selectedImg, setselectedImg] = useState(null);
    const navigate = useNavigate();
    const [name, setName] = useState(authUser.fullName)
    const [bio, setBio] = useState(authUser.bio)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedImg) {
            await updateProfile({ fullName: name, bio })
            navigate('/');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.onload = async () => {
            const base64Img = reader.result;
            await updateProfile({ profilePic: base64Img, fullName: name, bio });
            navigate('/');
        }
    }
    // return (
    return (
        <div className='min-h-screen bg-slate-900 flex items-center justify-center p-4'>
            <div className="w-full max-w-4xl bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col-reverse md:flex-row">

                {/* Form Section */}
                <div className="flex-1 p-8 md:p-12">
                    <div className="mb-8">
                        <h2 className='text-3xl font-bold text-white tracking-tight mb-2'>Edit Profile</h2>
                        <p className="text-slate-400">Update your personal details and public info.</p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Mobile Image Upload (Visible only on mobile) */}
                        <div className="md:hidden flex flex-col items-center mb-6">
                            <label className="relative group cursor-pointer">
                                <input onChange={(e) => setselectedImg(e.target.files[0])} type="file" accept='.png,.jpg,.jpeg' hidden />
                                <img
                                    src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || "/userLogo.png")}
                                    alt="profile"
                                    className='w-28 h-28 rounded-full object-cover border-4 border-slate-700 shadow-xl group-hover:opacity-75 transition-opacity'
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                    </svg>
                                </div>
                            </label>
                            <span className="text-sm text-indigo-400 mt-2 font-medium">Tap to change photo</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                type="text"
                                required
                                placeholder='Your name'
                                className='w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600'
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Bio</label>
                            <textarea
                                onChange={(e) => setBio(e.target.value)}
                                value={bio}
                                name="bio"
                                required
                                placeholder='Write a short bio...'
                                rows={4}
                                className='w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 resize-none'
                            ></textarea>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className='flex-1 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-200'
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className='flex-[2] py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-[0.98]'
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Desktop Image Section */}
                <div className="hidden md:flex flex-col items-center justify-center p-12 bg-slate-900/50 border-l border-slate-700/50 w-1/3 min-w-[300px]">
                    <div className="relative group cursor-pointer">
                        <label>
                            <input onChange={(e) => setselectedImg(e.target.files[0])} type="file" accept='.png,.jpg,.jpeg' hidden />
                            <div className="relative">
                                <img
                                    src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || "/userLogo.png")}
                                    alt="logo"
                                    className={`w-48 h-48 rounded-full object-cover border-4 border-slate-700 shadow-2xl transition-all duration-300 group-hover:border-indigo-500 group-hover:scale-[1.02]`}
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                    </svg>
                                </div>
                            </div>
                        </label>
                    </div>
                    <p className="mt-6 text-slate-400 text-sm font-medium">Click to update profile picture</p>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage