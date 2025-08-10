// components/WebsiteList.tsx or similar
// "use client";

// "use client";

// import { useAuth } from "@clerk/nextjs";
// import { deleteWebsite } from "../hooks/useWebsite";

// export function WebsiteList({ websites, refresh }: { websites: any[], refresh: () => void }) {
//   const { getToken } = useAuth(); // ✅ Correct source

//   const handleDelete = async (websiteId: string) => {
//     try {
//       const token = await getToken(); 
//       await deleteWebsite(websiteId, token!);
//       refresh(); // re-fetch websites
//     } catch (error) {
//       console.error("Error deleting website:", error);
//     }
//   };

//   return (
//     <div>
//       {websites.map((website) => (
//         <div key={website.id} className="flex justify-between items-center mb-2">
//           <span>{website.url}</span>
//           <button onClick={() => handleDelete(website.id)} className="text-red-600">
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
