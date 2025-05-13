import { Link, useNavigate } from "react-router-dom";  // To handle redirects
import Cookies from "js-cookie";  // To manage cookies
import {
  Navbar,
  Button,
  IconButton,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Bars3Icon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const navigate = useNavigate();  // Use navigate to redirect after logout

  const handleSignOut = () => {
    // Remove the token from cookies with path "/"
    const cok = Cookies.get('authToken')
    console.log("cok",cok)
  Cookies.remove('authToken');

    // Redirect to the login page
    navigate("/dashboard/login");
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5" : "px-0 py-1"}`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-row-reverse items-center justify-start w-full px-4">
        {/* Collapse menu (always visible on mobile) */}
        <IconButton
          variant="text"
          color="blue-gray"
          className="xl:hidden"
          onClick={() => setOpenSidenav(dispatch, !openSidenav)}
        >
          <Bars3Icon className="h-6 w-6 text-blue-gray-500" />
        </IconButton>

        {/* Sign out: full text button on xl+, icon-only on mobile */}


        <Button
          variant="text"
          color="blue-gray"
          className="hidden xl:flex items-center gap-2 normal-case font-arabic"
          onClick={handleSignOut}  // Trigger sign-out function
        >
          <UserCircleIcon className="h-5 w-5" />
          تسجيل الخروج
        </Button>

        <Link to={"/"} target="_blank">
        <Button
          variant="text"
          color="blue-gray"
          className="hidden xl:flex items-center gap-2 normal-case font-arabic"
        >
          <BookOpenIcon className="h-5 w-5" />
         واجهة الطلاب
        </Button>

</Link>
        <IconButton
          variant="text"
          color="blue-gray"
          className="xl:hidden"
          onClick={handleSignOut}  // Trigger sign-out function
        >
          <UserCircleIcon className="h-5 w-5" />
        </IconButton>
      </div>
    </Navbar>
  );
}
