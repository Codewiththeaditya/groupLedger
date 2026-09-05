export default function SignupDetail(){
    return(
        <div className=" p-5 py-2">
            <div className="py-3 text-3xl font-bold">
                <h1>Sign up</h1>
            </div>

            <div className="py-4">
                <p className="text-sm font-semibold">Full name</p>
                <input type="text" className="outline-none border w-100 h-10 rounded-lg mt-1 p-2"/>
            </div>

            <div className="py-4">
                <p className="text-sm font-semibold">Phone number</p>
                <input type="password" className="outline-none border w-100 h-10 rounded-lg mt-1 p-2" />
            </div>

            <div className="flex justify-center text-red-400">
                <p className="text-sm font-light">I use INR as my currency. Change</p>
            </div>

            <div className="py-4">
                <button className="w-100 h-10 font-semibold bg-blue-400 rounded-lg">Next</button>
            </div>
        </div>
    )
}