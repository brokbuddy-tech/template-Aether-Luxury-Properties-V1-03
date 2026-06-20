"use client";

import { useParams } from "next/navigation";
import { redirect } from "next/navigation";

export default function CommercialPropertyDetailPage() {
  const params = useParams();
  redirect(`/property/${params.id}`);
}
