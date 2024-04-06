import { useSession } from "next-auth/react";

function useIsOwner(user) {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === user?.id;
  return isOwner;
}

export default useIsOwner;
