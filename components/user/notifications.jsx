export default function UserNotification() {
  return (
    <div class="shadow p-8 my-8">
      <div class="mb-6">
        <h2 class="text-2xl font-semibold mb-4 text-[#202142]">
          Recent Notifications
        </h2>
        <div class="space-y-4 max-h-64 overflow-y-auto">
          <div class=" border  p-4 flex justify-between items-start">
            <div class="flex-grow">
              <h3 class="font-medium text-indigo-900">
                Welcome to our service!
              </h3>
              <p class="text-sm text-indigo-700">
                Thanks for signing up. We're thrilled to have you onboard.
              </p>
              <span class="text-xs text-indigo-500">2h ago</span>
            </div>
            <button
              type="button"
              class="ml-4 text-gray-400 hover:text-gray-500"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          class="px-4 py-2 bg-[#202142] text-white rounded-lg hover:bg-indigo-900 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:ring-opacity-50"
        >
          See All Notifications
        </button>
      </div>
    </div>
  );
}
