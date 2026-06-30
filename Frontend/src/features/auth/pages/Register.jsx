import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"


const Register = () => {

   const [showPassword , setShowPassword] = useState(false)
   const [firstName,setFirstName] = useState("")
   const [lastName , setLastName] = useState("")
    const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()




  async function handleRegister(e){
    e.preventDefault()
    setLoading(true)
         
    try{
  
       const result = await axios.post("http://localhost:3000/api/auth/register" , {
        email,
        password,
        firstName,
        lastName
       },{
        withCredentials:true
       })

       console.log(result.data)
       setLoading(false)
       navigate("/verify")
       toast.success(result.data.message)



    }catch(error){
      console.log(error)
      setLoading(false)
      toast.error(error.response.data.message)
    }

  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-200"> 
        <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-bold">Create your account</CardTitle>
        <CardDescription >
          Enter all field to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6 py-4 ">

            <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
              <Label htmlFor="firstName">firstName</Label>
              <Input
                id="firstName"
                type="firstName"
                placeholder="Kavi"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
               <div className="grid gap-2">
              <Label htmlFor="lastName">lastName</Label>
              <Input
                id="lastName"
                type="lastName"
                placeholder="Chauhan"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="kavi@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center relative ">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="................."  required  value={password} onChange={(e) => setPassword(e.target.value)}/>
              {
                showPassword ? <EyeOff onClick={() => setShowPassword(false)}/> : <Eye  onClick={() => setShowPassword(true)} />
              }
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full bg-purple-700" onClick={handleRegister}>
         {loading ? "Loading..." : "Register"}
        </Button>
        <div className=" shimmer-color-gray-500">
            Or
        </div>
        <Button variant="outline" className="w-full hover:border-purple-700">
           Register with Google
        </Button>
        <p>If Already have an Account <Link to="/login" className="hover:underline text-purple-700 cursor-pointer">Login</Link></p>
      </CardFooter>
    </Card>
     </div>
   
  )
}

export default Register