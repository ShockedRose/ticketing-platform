import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function PaymentStatusPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const success = searchParams.success === "true";
  const message = (searchParams.message as string) || (success ? "Payment Successful!" : "Payment Failed");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
        {success ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          </>
        ) : (
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        )}
        
        <h1 className={`text-2xl font-bold mb-2 ${success ? "text-green-700" : "text-red-700"}`}>
          {success ? "Payment Successful!" : "Payment Failed"}
        </h1>
        
        <p className="text-gray-600 mb-8">{message}</p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}