import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Input,
  Avatar,
} from "@material-tailwind/react";
import {
  EyeIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,  // certificate icon
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import api from "@/configs/api";

export default function StudentsInterface() {
  const [studentId, setStudentId] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"

  const handleSearch = async () => {
    const idTrim = studentId.trim();
    if (!idTrim) return;
    try {
      const { data } = await api.get("/certificates/search", {
        params: { studentId: idTrim },
      });
      setCertificates(data);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      setCertificates([]);
    }
  };

   function getDownloadUrl(certificateUrl) {
  // Insert "fl_attachment" immediately after "/upload"
  return certificateUrl.replace(
    "/upload/",
    "/upload/fl_attachment/" 
  );
}

  return (
    <>
      {/* Header with Logo & Title */}
      <div
        className="relative h-72 w-full n rounded-xl bg-cover bg-center bg-[url('/img/background-image.png')]"
      >
        <div className="absolute inset-0 bg-gray-900/75" />
        <div className="absolute inset-0 mb-32 flex flex-col justify-center items-center text-center p-4">
          <Avatar
            src="/img/logo.jpg"
            alt="Logo"
            size="xl"
            variant="circular"
          />
          <Typography variant="h3" className="mt-4 text-white font-arabic">
            حلول التعليمية
          </Typography>
        </div>
      </div>

      {/* Search Interface */}
      <Card className="mx-4 -mt-20 mb-8 border border-blue-gray-100 shadow  min-h-[600px]">
        <CardHeader className="p-6 text-right">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Avatar src="/img/search.png" size="xl" variant="rounded" />
              <div>
                <Typography variant="h2" className="font-arabic">
                  واجهة الطلاب
                </Typography>
                <Typography
                  variant="small"
                  className="text-blue-gray-300 font-arabic"
                >
                  ابحث عن شهاداتك باستخدام معرف الطالب
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-col md:flex-row">
              <Input
                label="معرف الطالب"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="font-arabic"
              />
              <Button
                onClick={handleSearch}
                className="font-arabic min-w-[140px] px-4 py-2 flex items-center justify-center gap-2"
                color="blue"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                بحث
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-6">
          {/* View-mode toggle */}
          {certificates.length > 0 && (
            <div className="flex items-center justify-end mb-4 space-x-2">
              <Button
                size="sm"
                className={`font-arabic ${
                  viewMode === "cards"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400"
                }`}
                onClick={() => setViewMode("cards")}
              >
                عرض بطاقات
              </Button>
              <Button
                size="sm"
                className={`font-arabic ${
                  viewMode === "table"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400"
                }`}
                onClick={() => setViewMode("table")}
              >
                عرض جدول
              </Button>
            </div>
          )}

          {/* Prompt / No results */}
          {!studentId.trim() && (
            <Typography className="font-arabic text-center text-gray-500">
              من فضلك أدخل معرف الطالب للبحث عن الشهادات.
            </Typography>
          )}
          {studentId.trim() && certificates.length === 0 && (
            <Typography className="font-arabic text-center text-red-500">
              لا توجد شهادات لهذا المعرف
            </Typography>
          )}

          {/* Cards View */}
          {certificates.length > 0 && viewMode === "cards" && (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert, idx) => (
                <CardBody
                  key={cert._id}
                  className="relative border flex flex-col items-center p-6"
                >
                  <Typography className="absolute top-2 left-2 text-xs text-gray-500 font-arabic">
                    {new Date(cert.createdAt).toLocaleDateString("ar-EG")}
                  </Typography>

                  {/* Certificate Icon & Name */}
                  <DocumentTextIcon className="h-12 w-12 text-blue-gray-500" />
                  <Typography variant="h6" className="mt-2 font-arabic">
                    شهادة {idx + 1}
                  </Typography>

                  {/* Actions: View & Download */}
                  <div className="flex justify-center mt-4 gap-4">
                    <Link to={cert.certificateUrl} target="_blank">
                      <EyeIcon className="h-6 w-6 text-blue-gray-500 hover:text-blue-700" />
                    </Link>
                    <Link
                      to={getDownloadUrl(cert.certificateUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ArrowDownTrayIcon className="h-6 w-6 text-green-500 hover:text-green-700" />
                    </Link>
                  </div>
                </CardBody>
                
              ))}
            </div>
          )}

          {/* Table View */}
          {certificates.length > 0 && viewMode === "table" && (
            <table className="min-w-full table-auto text-right font-arabic">
              <thead>
                <tr>
                  <th className="px-4 py-2">الشهادة</th>
                  <th className="px-4 py-2">التاريخ</th>
                  <th className="px-4 py-2">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert,idx) => (
                  <tr key={cert._id} className="border-t">
                  <Typography variant="h6" className="mt-2 font-arabic">
                    شهادة {idx + 1}
                  </Typography>
                    <td className="px-4 py-2">
                      {new Date(cert.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-4 py-2 flex justify-center space-x-4">
                  <div className="flex w-full">
                                          <Link to={cert.certificateUrl} target="_blank">
                        <EyeIcon className="h-5 w-5 text-blue-gray-500 hover:text-blue-700" />
                      </Link>
                      <Link to={cert.certificateUrl} download>
                        <ArrowDownTrayIcon className="h-5 w-5 text-green-500 hover:text-green-700" />
                      </Link>
                  </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
                        <footer className="py-2">
        <div className="text-center">
        <Typography variant="small" className="font-normal text-inherit text-center font-arabic">
           حلول التعليمية &copy; 2025
        </Typography>
      </div>
      </footer>
    </>
  );
}
