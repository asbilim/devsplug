import UserNavigation from "@/components/user/navigation";
import UserProfilePage from "@/components/user/profileform";
import UserPasswordChange from "@/components/user/password";
import Header from "@/components/layout/header";
import UserNotification from "@/components/user/notifications";
import Footer from "@/components/layout/footer";
export default async function Test({ params }) {
  const { section } = params;
  let currentSection;
  if (section) {
    currentSection = section[0];
  }

  return (
    <div className="flex flex-col gap-12">
      <Header />
      <div class="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
        <UserNavigation />
        <main class="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
          <div class="p-2 md:p-4">
            <div class="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
              <h2 class="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
              {currentSection === "password" ? (
                <UserPasswordChange />
              ) : currentSection === "notifications" ? (
                <UserNotification />
              ) : (
                <UserProfilePage />
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
