import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserCard } from '~/features/user-card';
import { UsersService } from '~/server/routes/users/users.route';
import { USER_BUSINESS_INFO_FORM_CONFIG, USER_INFO_FORM_CONFIG } from './constants/user-card-config.const';

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    return redirect('/');
  }

  const userData = await UsersService.getUser(user.id);

  if (!userData) {
    return redirect('/');
  }

  const initialBankData = {
    taxIndex: userData.taxIndex ?? '',
    bankAccount: userData.bankAccount ?? '',
  }

  const initialUserInfoData = {
    email: userData.email ?? '',
    name: userData.name ?? '',
    country: userData.country ?? '',
    city: userData.city ?? '',
    address: userData.address ?? '',
    zip: userData.zip ?? '',
  }

  return (
    <div className="flex flex-col gap-4">
      <UserCard config={USER_INFO_FORM_CONFIG} initialData={initialUserInfoData} />
      <UserCard config={USER_BUSINESS_INFO_FORM_CONFIG} initialData={initialBankData} />
    </div>
  );
}
