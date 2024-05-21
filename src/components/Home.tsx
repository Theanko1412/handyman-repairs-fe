import Header from "./Header";


export default function Home() {
   return (
      <>
         <Header />
      <div className="flex flex-col items-center justify-center h-screen">
         <h1 className="text-4xl font-bold">Welcome to Handyman Repairs</h1>
         <p className="text-lg mt-4">The best place to find handymen and services</p>
      </div>
      </>
   )
}
   