// src/pages/AddCertificates.jsx

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Input,
  Avatar,
  IconButton,
} from "@material-tailwind/react";
import {
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/configs/api";
import Upload from "@/widgets/Upload";

export default function AddCertificates() {
  const [studentId, setStudentId] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);

  const handleSearch = async () => {
    const id = studentId.trim();
    if (!id) return;
    try {
      const { data } = await api.get("/certificates/search", {
        params: { studentId: id },
      });
      setCertificates(data);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      setCertificates([]);
    }
  };

  const onUploaded = (newCerts) => {
    setCertificates((prev) => [...newCerts, ...prev]);
    setShowUpload(false);
    toast.success("تم رفع الشهادات بنجاح");
  };

  const handleDelete = async (certId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الشهادة؟")) return;
    setDeletingIds((prev) => [...prev, certId]);
    try {
      await api.delete(`/certificates/${certId}`);
      setCertificates((prev) => prev.filter((c) => c._id !== certId));
      toast.success("تم حذف الشهادة بنجاح");
    } catch (err) {
      console.error("Error deleting certificate:", err);
      toast.error("حدث خطأ أثناء حذف الشهادة");
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== certId));
    }
  };

  const getDownloadUrl = (url) =>
    url.replace("/upload/", "/upload/fl_attachment/");

  return (
    <>
      {/* Header Background */}
      <div
        className="relative mt-8 h-72 w-full rounded-xl bg-cover bg-center bg-[url('/img/background-image.png')]"
      >
        <div className="absolute inset-0 bg-gray-900/75" />
      </div>

      {/* Main Card */}
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100 shadow">
        {/* Title */}
        <CardHeader className="p-4 text-right">
          <div className="flex items-center gap-4">
            <Avatar src="/img/search.png" size="xl" variant="rounded" />
            <div>
              <Typography variant="h2" className="font-arabic">
                إضافة شهادات الطلاب
              </Typography>
              <Typography
                variant="small"
                className="text-blue-gray-600 font-arabic"
              >
                ابحث عن شهادات أو أضف شهادات جديدة
              </Typography>
            </div>
          </div>
        </CardHeader>

        {/* Search & Upload Controls */}
        <CardBody className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
              label="معرف الطالب"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="font-arabic flex-1"
            />
            <Button
              onClick={handleSearch}
              className="min-w-[140px] flex items-center gap-2 font-arabic"
              color="blue"
              disabled={!studentId.trim()}
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-white" />
              بحث
            </Button>
            <Button
              color="green"
              className="min-w-[140px] flex items-center gap-2 font-arabic"
              onClick={() => setShowUpload((v) => !v)}
              disabled={!studentId.trim()}
            >
              <PlusCircleIcon className="h-5 w-5 text-white" />
              {showUpload ? "إخفاء الرفع" : "بدء الرفع"}
            </Button>
          </div>

          {/* Upload Section */}
          {showUpload && studentId.trim() && (
            <div className="relative bg-white rounded-lg shadow p-4 border border-gray-200">
              <IconButton
                variant="text"
                color="gray"
                className="absolute top-2 right-2"
                onClick={() => setShowUpload(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </IconButton>
              <Upload studentId={studentId.trim()} onUploaded={onUploaded} />
            </div>
          )}

          {/* Certificates Grid */}
          <Typography variant="h5" className="font-arabic text-center">
            شهادات الطالب
          </Typography>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {certificates.length > 0 ? (
              certificates.map((cert, idx) => (
                <CardBody
                  key={cert._id}
                  className="relative border flex flex-col items-center p-6"
                >
                  <Typography className="absolute top-2 left-2 text-xs text-gray-500 font-arabic">
                    {new Date(cert.createdAt).toLocaleDateString("ar-EG")}
                  </Typography>
                  <DocumentTextIcon className="h-12 w-12 text-blue-gray-500" />
                  <Typography variant="h6" className="mt-2 font-arabic">
                    شهادة {idx + 1}
                  </Typography>
                  <div className="flex justify-center mt-4 gap-4">
                    <Link to={cert.certificateUrl} target="_blank">
                      <EyeIcon className="h-6 w-6 text-blue-gray-500 hover:text-blue-700" />
                    </Link>
                    <Link to={getDownloadUrl(cert.certificateUrl)}>
                      <ArrowDownTrayIcon className="h-6 w-6 text-green-500 hover:text-green-700" />
                    </Link>
                    <IconButton
                      size="sm"
                      variant="text"
                      color="red"
                      onClick={() => handleDelete(cert._id)}
                      disabled={deletingIds.includes(cert._id)}
                    >
                      {deletingIds.includes(cert._id) ? (
                        <svg
                          className="animate-spin h-5 w-5 text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z"
                          />
                        </svg>
                      ) : (
                        <TrashIcon className="h-5 w-5" />
                      )}
                    </IconButton>
                  </div>
                </CardBody>
              ))
            ) : (
              <Typography className="font-arabic text-center text-gray-500 col-span-full">
                لا توجد شهادات لهذا الطالب
              </Typography>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
