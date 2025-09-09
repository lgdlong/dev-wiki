// "use client";
// //mock (giả chưa xài đc tạm thời không đụng)
// import { useState } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import UserEditForm from "@/components/admin/users/user-edit-form";
// import UserSecurity from "@/components/admin/users/user-security";
// import UserActivity from "@/components/admin/users/user-activity";
// import UserActions from "@/components/admin/users/user-actions";

// export default function EditUserPage() {
//   const [user, setUser] = useState({
//     id: 1,
//     name: "John Smith",
//     email: "john.smith@email.com",
//     phone: "+84 912 345 678",
//     dob: "1990-05-15",
//     gender: "Nam",
//     role: "User",
//     address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
//     bio: "Người dùng thông thường, thích công nghệ và đọc sách.",
//     status: "Active",
//   });

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa người dùng</h1>

//       <div className="flex items-center gap-4 mb-6">
//         <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
//           <span className="text-lg font-bold">JS</span>
//         </div>
//         <div>
//           <p className="font-semibold">{user.name}</p>
//           <p className="text-sm text-muted-foreground">{user.email}</p>
//         </div>
//       </div>

//       <Tabs defaultValue="profile">
//         <TabsList>
//           <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
//           <TabsTrigger value="security">Bảo mật</TabsTrigger>
//           <TabsTrigger value="activity">Hoạt động</TabsTrigger>
//           <TabsTrigger value="actions">Hành động</TabsTrigger>
//         </TabsList>

//         <TabsContent value="profile">
//           <UserEditForm user={user} onChange={setUser} />
//         </TabsContent>

//         <TabsContent value="security">
//           <UserSecurity user={user} />
//         </TabsContent>

//         <TabsContent value="activity">
//           <UserActivity userId={user.id} />
//         </TabsContent>

//         <TabsContent value="actions">
//           <UserActions user={user} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
