import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Management } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import AddCertificates from "./pages/dashboard/certificates";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "الرئيسية",
        path: "/",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "واجهة البحث والادارة",
        path: "/management",
        element: <Management />, 
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "اضافة الشهادات",
        path: "/students",
        element: <AddCertificates />,
      },
    ],
  },
];

export default routes;
