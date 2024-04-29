import { auth } from '@clerk/nextjs/server';


export default function InvoicesPage() {
  const user = auth();
  
  return <div>{user.sessionId}</div>;
}