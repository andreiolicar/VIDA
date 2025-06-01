import UserProfile from './UserProfile';

export default function DashboardRightPanel() {
  return (
    <aside className="hidden xl:flex flex-col w-[320px] text-white px-6 py-8 space-y-6">
      <UserProfile />
    </aside>
  );
}
