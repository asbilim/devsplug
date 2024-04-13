import { Button } from "@/components/ui/button";
import Link from "next/link";
import NotFoundLayout from "@/components/pages/states/404";
export default function NotFound() {
  return (
    <NotFoundLayout>
      <div className="flex mt-36 flex-col  items-center justify-center gap-12 px-3">
        <h1 className="text-9xl font-bold">404</h1>
        <p className="text-center">
          we are sorry but the page you are looking for {"doesn't"} exist in our
          server
        </p>
        <Button>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </NotFoundLayout>
  );
}
