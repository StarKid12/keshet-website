import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PendingApprovalPage() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-sand-200 p-8 text-center">
      <img src="/images/logo.png" alt="קשת" className="h-16 mx-auto mb-6" />

      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-sand-900 mb-3">
        הבקשה שלכם ממתינה לאישור
      </h1>
      <p className="text-sand-600 mb-2">
        תודה שנרשמתם! הבקשה שלכם התקבלה ונמצאת בבדיקה.
      </p>
      <p className="text-sand-600 mb-8">
        נשלח לכם הודעה ברגע שהגישה תאושר.
      </p>

      <Link href="/">
        <Button variant="outline">חזרה לאתר הראשי</Button>
      </Link>
    </div>
  );
}
