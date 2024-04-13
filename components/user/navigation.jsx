export default function UserNavigation() {
  return (
    <aside class="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
      <div class="sticky flex flex-col gap-2 p-4 text-sm border-r  top-12">
        <h2 class="pl-3 mb-4 text-2xl font-semibold">Settings</h2>

        <a
          href="/settings/user/profile/"
          class="flex items-center px-3 py-2.5 font-bold border rounded-full"
        >
          Pubic Profile
        </a>
        <a
          href="/settings/user/profile/password"
          class="flex items-center px-3 py-2.5 font-semibold  hover:text-indigo-900 hover:border hover:rounded-full"
        >
          Password Settings
        </a>
        <a
          href="/settings/user/profile/notifications/"
          class="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full  "
        >
          Notifications
        </a>
        <a
          href="/dashboard/bio/edit"
          class="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full  "
        >
          Edit bio
        </a>
      </div>
    </aside>
  );
}
