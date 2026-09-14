import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/services/api";
import { Building2, Eye, EyeOff } from "lucide-react";


function Login(){

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);


  const handleLogin = async()=>{

    try{

      const data = await authAPI.login({
        email,
        password
      });


      sessionStorage.setItem(
        "token",
        data.token
      );


      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      navigate("/");


    }
    catch(error){
      
      console.error("LOGIN ERROR:", error);

      alert(
        error instanceof Error
        ? error.message
        : "Login failed"
      );

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-50">


      <div className="w-full max-w-md">


        <div className="bg-white border rounded-2xl shadow-lg p-8">


          <div className="flex flex-col items-center mb-8">


            <div className="bg-blue-600 text-white p-4 rounded-xl mb-4">

              <Building2 size={35}/>

            </div>


            <h1 className="text-3xl font-bold text-slate-800">
              Aastha Engineering
            </h1>


            <p className="text-muted-foreground mt-1">
              Production Management System
            </p>


          </div>



          <h2 className="text-xl font-semibold mb-6 text-center">
            Administrator Login
          </h2>



          <div className="space-y-4">


            <div>

              <label className="text-sm font-medium">
                Email
              </label>

              <input

                className="mt-2 w-full h-11 border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500"

                placeholder="admin@aastha.com"

                value={email}

                onChange={(e)=>setEmail(e.target.value)}

              />

            </div>




            <div>

              <label className="text-sm font-medium">
                Password
              </label>


              <div className="relative">

                <input

                  className="mt-2 w-full h-11 border rounded-lg px-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500"

                  type={
                    showPassword
                    ?
                    "text"
                    :
                    "password"
                  }

                  placeholder="Enter password"

                  value={password}

                  onChange={(e)=>setPassword(e.target.value)}

                />


                <button

                  type="button"

                  className="absolute right-3 top-5 text-gray-500"

                  onClick={()=>setShowPassword(!showPassword)}

                >

                  {
                    showPassword
                    ?
                    <EyeOff size={18}/>
                    :
                    <Eye size={18}/>
                  }


                </button>


              </div>


            </div>





            <button

              onClick={handleLogin}

              className="w-full h-11 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"

            >

              Login

            </button>



          </div>



          <p className="text-center text-xs text-muted-foreground mt-6">

            Secure Administrator Access

          </p>


        </div>


      </div>


    </div>

  );


}


export default Login;