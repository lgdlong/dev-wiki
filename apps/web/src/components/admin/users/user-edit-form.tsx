// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

  
// type UserEditFormProps = {
//   user: User;
//   onChange: React.Dispatch<React.SetStateAction<User>>;
//   // cách khác: onChange: (next: User) => void;
// };
  
// export default function UserEditForm({ user, onChange }: UserEditFormProps) {
//   return (
//     <form className="space-y-4 mt-4 max-w-2xl">
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="text-sm">Họ và tên</label>
//           <Input value={user.name} onChange={(e) => onChange({ ...user, name: e.target.value })} />
//         </div>
//         <div>
//           <label className="text-sm">Email</label>
//           <Input type="email" value={user.email} onChange={(e) => onChange({ ...user, email: e.target.value })} />
//         </div>
//         <div>
//           <label className="text-sm">Số điện thoại</label>
//           <Input value={user.phone} onChange={(e) => onChange({ ...user, phone: e.target.value })} />
//         </div>
//         <div>
//           <label className="text-sm">Ngày sinh</label>
//           <Input type="date" value={user.dob} onChange={(e) => onChange({ ...user, dob: e.target.value })} />
//         </div>
//         <div>
//           <label className="text-sm">Giới tính</label>
//           <Select value={user.gender} onValueChange={(v) => onChange({ ...user, gender: v })}>
//             <SelectTrigger><SelectValue /></SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Nam">Nam</SelectItem>
//               <SelectItem value="Nữ">Nữ</SelectItem>
//               <SelectItem value="Khác">Khác</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <label className="text-sm">Vai trò</label>
//           <Select value={user.role} onValueChange={(v) => onChange({ ...user, role: v })}>
//             <SelectTrigger><SelectValue /></SelectTrigger>
//             <SelectContent>
//               <SelectItem value="User">User</SelectItem>
//               <SelectItem value="Admin">Admin</SelectItem>
//               <SelectItem value="Mod">Mod</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div>
//         <label className="text-sm">Địa chỉ</label>
//         <Input value={user.address} onChange={(e) => onChange({ ...user, address: e.target.value })} /> 
//       </div>

//       <div>
//         <label className="text-sm">Tiểu sử</label>
//         <Textarea value={user.bio} onChange={(e) => onChange({ ...user, bio: e.target.value })} />
//       </div>

//       <div className="flex gap-2 justify-end">
//         <Button variant="outline">Hủy</Button>
//         <Button>Lưu thay đổi</Button>
//       </div>
//     </form>
//   );
// }
