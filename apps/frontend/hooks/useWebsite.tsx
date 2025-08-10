"use client";
import { API_BACKEND_URL } from "../config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

interface Website {
    id: string;
    url: string;
    ticks: {
        id: string;
        createdAt: string;
        status: string;
        latency: number;
    }[];
}

export function useWebsites() {
    const { getToken } = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);

    async function refreshWebsites() {    
        const token = await getToken();
        const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
            headers: {
                Authorization: token,
            },
        });

        setWebsites(response.data.websites);
    }

    useEffect(() => {
        refreshWebsites();

        const interval = setInterval(() => {
            refreshWebsites();
        }, 1000 * 60 * 1);

        return () => clearInterval(interval);
    }, []);

    return { websites, refreshWebsites };

}
// utils/api.ts or wherever appropriate

export async function deleteWebsite(websiteId: string, token: string) {
  try {
    const res = await axios.delete(`${API_BACKEND_URL}/api/v1/delete`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { websiteId }, // `data` is used for DELETE body in axios
    });

    return res.data;
  } catch (error: any) {
    console.error("Failed to delete website", error.response?.data || error.message);
    throw new Error("Failed to delete website");
  }
}

