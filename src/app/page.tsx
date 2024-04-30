import { SignInButton } from "@clerk/nextjs";
import { auth } from '@clerk/nextjs/server';

export default function HomePage() {
  const user = auth();

  console.log(user, 'user');
  
  
  return !user.userId ? <SignInButton fallbackRedirectUrl="/invoices" /> : <div>TEst</div>; 
}
